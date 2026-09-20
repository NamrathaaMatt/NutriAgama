import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard product={product} key={product.slug} />
      ))}
    </div>
  );
}