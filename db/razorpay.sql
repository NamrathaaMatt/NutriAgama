-- =============================================================================
-- Razorpay payment integration — orders, payments, payment_events
-- =============================================================================
--
-- WHAT THIS SCRIPT DOES (all idempotent, safe to re-run):
--   1. public.orders           — ALREADY EXISTS: adds the payment columns
--   2. public.order_items      — ALREADY EXISTS: used for line items, untouched
--   3. public.payments         — created: one row per online payment attempt
--   4. public.payment_events   — created: webhook/verify event log (idempotency)
--   5. Indexes, RLS on the new tables, and two SECURITY DEFINER functions:
--        confirm_razorpay_payment()  — atomic "payment paid + order paid"
--        mark_razorpay_payment_failed() — guarded failure transition
--
-- WHAT IT ASSUMES ALREADY EXISTS:
--   - Supabase project with public schema, auth schema and auth.users table
--   - Roles: anon, authenticated, service_role (standard Supabase)
--   - Tables NOT created here (already in use): products, cart_items, addresses,
--     coupons, profiles, categories, orders, order_items, wellness_preferences,
--     wishlist_items, reviews
--   - orders / order_items already have RLS enabled with their own policies
--     (is_admin() for admins, read-own-rows for the owner). Left untouched —
--     every API route uses the service-role key, which bypasses RLS.
--   - orders.status CHECK allows pending / paid / shipped / delivered /
--     cancelled, so payment confirmation sets status='paid' (never 'confirmed').
--   - NO stock/inventory table — stock deduction is intentionally out of scope
--
-- RUN ORDER: run this single file top-to-bottom in the Supabase SQL editor.
--   Tables must be created before indexes/RLS; functions after tables.
--
-- NOTE ON UNITS: payments.amount is stored in PAISE (Razorpay's smallest
--   currency unit). orders.total is stored in RUPEES.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. orders — ALREADY EXISTS. Add only the payment columns this integration
--    needs; nothing existing is renamed, retyped, or dropped.
--
--      already there: id, user_id, status, total, customer_name, customer_phone,
--                     shipping_address (text), created_at
--      added here:    email, currency, payment_method, payment_status, updated_at
--
--    Line items go in the existing `order_items` table (not a jsonb column),
--    and the shipping address stays a formatted string in `shipping_address`.
--    Re-running this script skips columns that already exist.
-- -----------------------------------------------------------------------------
alter table public.orders
  add column if not exists email           text,
  add column if not exists currency        text not null default 'INR',
  add column if not exists payment_method  text not null default 'razorpay'
                                check (payment_method in ('razorpay', 'cod')),
  add column if not exists payment_status  text not null default 'pending'
                                check (payment_status in ('pending', 'cod_pending', 'paid', 'failed')),
  add column if not exists updated_at      timestamptz not null default now();

-- -----------------------------------------------------------------------------
-- 2. payments (online payments only — COD creates no payment row)
-- -----------------------------------------------------------------------------
create table if not exists public.payments (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders (id) on delete cascade,
  payment_provider  text not null default 'razorpay',     -- always 'razorpay'
  transaction_id    text,                                  -- razorpay payment id (pay_...)
  provider_order_id text,                                  -- razorpay order id (order_...)
  amount            bigint not null,                       -- PAISE (x100 of rupees)
  currency          text not null default 'INR',
  status            text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  raw_response      jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- provider_order_id must be unique/indexed (webhook + verify look up by it)
create unique index if not exists payments_provider_order_id_key
  on public.payments (provider_order_id);
create index if not exists payments_order_id_idx
  on public.payments (order_id);

-- -----------------------------------------------------------------------------
-- 3. payment_events (webhook idempotency + audit trail)
-- -----------------------------------------------------------------------------
create table if not exists public.payment_events (
  id         uuid primary key default gen_random_uuid(),
  event_id   text not null,          -- "<event>:<pay_id>" (or "verify:<pay_id>")
  payment_id text,                   -- razorpay payment id when known
  event_type text not null,          -- payment.captured / payment.failed / payment.verified
  payload    jsonb not null,
  created_at timestamptz not null default now()
);

create unique index if not exists payment_events_event_id_key
  on public.payment_events (event_id);

-- -----------------------------------------------------------------------------
-- 4. Row Level Security
--    Clients get NO write access: every insert/update goes through the API
--    routes using the service-role key (which bypasses RLS).
--
--    `orders` and `order_items` already have RLS enabled plus their own
--    policies (is_admin() / read-own-rows). Those are deliberately left
--    alone — this script only manages the tables it creates.
-- -----------------------------------------------------------------------------
alter table public.payments       enable row level security;
alter table public.payment_events enable row level security;

-- payments / payment_events: no client policies (service-role only).

-- -----------------------------------------------------------------------------
-- 5. Atomic confirmation: mark payment paid + order paid in ONE transaction
--    (called by POST /api/payment/verify and the webhook handler)
-- -----------------------------------------------------------------------------
create or replace function public.confirm_razorpay_payment (
  p_provider_order_id text,
  p_payment_id        text,
  p_raw_response      jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.payments%rowtype;
begin
  select * into v_payment
    from public.payments
    where provider_order_id = p_provider_order_id
    for update;   -- lock the row so concurrent verify+webhook can't double-apply

  if not found then
    raise exception 'No payment record for provider_order_id %', p_provider_order_id;
  end if;

  -- Idempotent: already confirmed -> return early without re-processing.
  if v_payment.status = 'paid' then
    return jsonb_build_object('status', 'already_paid', 'order_id', v_payment.order_id);
  end if;

  update public.payments
     set status         = 'paid',
         transaction_id = coalesce(p_payment_id, transaction_id),
         raw_response   = coalesce(p_raw_response, raw_response),
         updated_at     = now()
   where id = v_payment.id;

  -- `paid` matches the pre-existing orders.status CHECK
  -- (pending/paid/shipped/delivered/cancelled); 'confirmed' would violate it.
  update public.orders
     set payment_status = 'paid',
         status         = 'paid',
         updated_at     = now()
   where id = v_payment.order_id
     and payment_status <> 'paid';   -- never downgrade a paid order

  return jsonb_build_object('status', 'paid', 'order_id', v_payment.order_id);
end;
$$;

-- -----------------------------------------------------------------------------
-- 6. Payment failure transition (guarded: never downgrades a paid payment)
-- -----------------------------------------------------------------------------
create or replace function public.mark_razorpay_payment_failed (
  p_provider_order_id text,
  p_payment_id        text default null,
  p_raw_response      jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.payments%rowtype;
begin
  select * into v_payment
    from public.payments
    where provider_order_id = p_provider_order_id
    for update;

  if not found then
    raise exception 'No payment record for provider_order_id %', p_provider_order_id;
  end if;

  if v_payment.status = 'paid' then
    return jsonb_build_object('status', 'already_paid', 'order_id', v_payment.order_id);
  end if;

  update public.payments
     set status         = 'failed',
         transaction_id = coalesce(p_payment_id, transaction_id),
         raw_response   = coalesce(p_raw_response, raw_response),
         updated_at     = now()
   where id = v_payment.id;

  update public.orders
     set payment_status = 'failed',
         updated_at     = now()
   where id = v_payment.order_id
     and payment_status in ('pending', 'cod_pending');

  return jsonb_build_object('status', 'failed', 'order_id', v_payment.order_id);
end;
$$;

-- -----------------------------------------------------------------------------
-- 7. Lock functions down: only the service-role key (API routes) may call them.
--    (Postgres grants EXECUTE to PUBLIC by default — revoke it.)
-- -----------------------------------------------------------------------------
revoke execute on function public.confirm_razorpay_payment(text, text, jsonb)
  from public, anon, authenticated;
grant  execute on function public.confirm_razorpay_payment(text, text, jsonb)
  to service_role;

revoke execute on function public.mark_razorpay_payment_failed(text, text, jsonb)
  from public, anon, authenticated;
grant  execute on function public.mark_razorpay_payment_failed(text, text, jsonb)
  to service_role;

-- =============================================================================
-- End of script.
-- =============================================================================
