type ShopHeroProps = {
  onShopNow: () => void;
};

export default function ShopHero({ onShopNow }: ShopHeroProps) {
  return (
    <section className="hero">
      <div className="heroContent">
        <button className="heroCta" type="button" onClick={onShopNow}>
          Shop Now <span aria-hidden="true">↓</span>
        </button>
      </div>
    </section>
  );
}