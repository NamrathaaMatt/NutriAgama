-- 002: Product sizes (variants) with their own price and stock.
-- Already applied. Moves the cart to size level. This file contains the
-- corrected stock trigger (it no longer reads OLD on inserts).

begin;

-- 1. Variants table
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  price numeric not null check (price >= 0),
  mrp numeric not null check (mrp >= 0),
  in_stock boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, label)
);

alter table public.product_variants enable row level security;

drop policy if exists "Variants are public to read" on public.product_variants;
create policy "Variants are public to read"
  on public.product_variants for select using (true);

-- 2. Client prices (MRP equals price until the client sends MRPs)
insert into public.product_variants (product_id, label, price, mrp, sort_order)
select p.id, v.label, v.price, v.price, v.sort_order
from (values
  ('moringa',        '100 g', 155,  1),
  ('kashaya',        '100 g', 115,  1),
  ('menthe-mudde',   '500 g', 210,  1),
  ('menthe-mudde',   '1 kg',  425,  2),
  ('protein-powder', '200 g', 385,  1),
  ('protein-powder', '500 g', 925,  2),
  ('protein-powder', '1 kg',  1800, 3)
) as v(slug, label, price, sort_order)
join public.products p on p.slug = v.slug
on conflict (product_id, label) do nothing;

-- 3. Keep the old product columns consistent (smallest size)
update public.products p
set price = v.price, mrp = v.mrp, net_weight = v.label
from (
  select distinct on (product_id) product_id, price, mrp, label
  from public.product_variants
  order by product_id, sort_order
) v
where v.product_id = p.id;

-- 4. products.in_stock is true if any size is in stock
create or replace function public.sync_product_stock()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.products
  set in_stock = coalesce(
    (select bool_or(in_stock) from public.product_variants where product_id = new.product_id),
    true
  )
  where id = new.product_id;
  return null;
end;
$$;

drop trigger if exists product_variants_sync_stock on public.product_variants;
create trigger product_variants_sync_stock
after insert or update of in_stock on public.product_variants
for each row execute function public.sync_product_stock();

-- 5. Cart rows now point at a size
drop trigger if exists cart_items_check_stock on public.cart_items;

alter table public.cart_items
  add column if not exists variant_id uuid references public.product_variants(id) on delete cascade;

update public.cart_items c
set variant_id = (
  select v.id from public.product_variants v
  where v.product_id = c.product_id
  order by v.sort_order
  limit 1
)
where c.variant_id is null;

alter table public.cart_items alter column variant_id set not null;

alter table public.cart_items drop constraint if exists cart_items_user_product_key;
alter table public.cart_items drop constraint if exists cart_items_user_variant_key;
alter table public.cart_items
  add constraint cart_items_user_variant_key unique (user_id, variant_id);

-- 6. Stock check per size. It fills in product_id from the size, and only
--    blocks inserts and quantity increases, so lowering quantity still works.
create or replace function public.check_cart_stock()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v record;
begin
  select product_id, in_stock into v
  from public.product_variants
  where id = new.variant_id;

  if not found then
    raise exception 'Product size not found';
  end if;

  new.product_id := v.product_id;

  if tg_op = 'INSERT' then
    if not v.in_stock then
      raise exception 'Product is out of stock';
    end if;
  elsif new.quantity > old.quantity and not v.in_stock then
    raise exception 'Product is out of stock';
  end if;

  return new;
end;
$$;

drop trigger if exists cart_items_check_stock on public.cart_items;
create trigger cart_items_check_stock
before insert or update on public.cart_items
for each row execute function public.check_cart_stock();

commit;