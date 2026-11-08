-- 001: Cart and wishlist rules, plus a stock check in the database.
-- Already applied. Superseded in part by 002 and 003, which move the
-- rules from product level to size (variant) level. Kept as history.

begin;

-- One row per user and product
alter table public.cart_items
  drop constraint if exists cart_items_user_product_key;
alter table public.cart_items
  add constraint cart_items_user_product_key unique (user_id, product_id);

alter table public.wishlist_items
  drop constraint if exists wishlist_items_user_product_key;
alter table public.wishlist_items
  add constraint wishlist_items_user_product_key unique (user_id, product_id);

-- Block out-of-stock products from entering the cart
create or replace function public.check_cart_stock()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not coalesce((select in_stock from public.products where id = new.product_id), true) then
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