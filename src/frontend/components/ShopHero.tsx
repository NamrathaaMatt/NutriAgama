type ShopHeroProps = {
  onShopNow: () => void;
};

export default function ShopHero({ onShopNow }: ShopHeroProps) {
  return (
    <section className="hero">
      <div className="heroContent">
          <button className="shop-now-btn heroCta" onClick={onShopNow}>Shop Now ↓</button>
      </div>
    </section>
  );
}