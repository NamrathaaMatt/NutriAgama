"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import styles from "../styles/home.module.css";

type HomeProductProps = {
  product: StaticImageData;
  slideId: string;
  productSlug: string;
};

export default function HomeProduct({
  product,
  slideId,
  productSlug,
}: HomeProductProps) {
  return (
    <Link
      href={`/shop/${productSlug}`}
      className={styles.productLink}
      aria-label={`View ${slideId} product`}
    >
      <div className={styles.product}>
        <Image
          src={product}
          alt={`${slideId} product`}
          width={product.width}
          height={product.height}
          priority
          className={styles.productImage}
        />
      </div>
    </Link>
  );
}
