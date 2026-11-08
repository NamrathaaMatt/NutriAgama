-- 003: Wishlist stores each size separately, and old product-level
-- unique rules are removed from cart and wishlist.
-- Already applied.

begin;

-- A. Drop leftover "one row per product" unique rules on cart and wishlist
do $$
declare
  c record;
begin
  for c in
    select conrelid::regclass as tbl, conname
    from pg_constraint
    where contype = 'u'
      and conrelid in ('public.cart_items'::regclass, 'public.wishlist_items'::regclass)
      and pg_get_constraintdef(oid) = 'UNIQUE (user_id, product_id)'
  loop
    execute format('alter table %s drop constraint %I', c.tbl, c.conname);
  end loop;
end $$;

-- B. Wishlist rows point at a size
alter table public.wishlist_items
  add column if not exists variant_id uuid references public.product_variants(id) on delete cascade;

update public.wishlist_items w
set variant_id = (
  select v.id from public.product_variants v
  where v.product_id = w.product_id
  order by v.sort_order
  limit 1
)
where w.variant_id is null;

delete from public.wishlist_items where variant_id is null;

alter table public.wishlist_items alter column variant_id set not null;

alter table public.wishlist_items drop constraint if exists wishlist_items_user_product_key;
alter table public.wishlist_items drop constraint if exists wishlist_items_user_variant_key;
alter table public.wishlist_items
  add constraint wishlist_items_user_variant_key unique (user_id, variant_id);

-- C. Fill product_id from the size on insert
create or replace function public.fill_wishlist_product()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  pid uuid;
begin
  select product_id into pid
  from public.product_variants
  where id = new.variant_id;

  if pid is null then
    raise exception 'Product size not found';
  end if;

  new.product_id := pid;
  return new;
end;
$$;

drop trigger if exists wishlist_items_fill_product on public.wishlist_items;
create trigger wishlist_items_fill_product
before insert or update on public.wishlist_items
for each row execute function public.fill_wishlist_product();

commit;