import Link from "next/link";
import styles from "../styles/home.module.css";

export default function HomeShopButton() {
  return (
    <Link href="/shop" className={styles.shopButton}>
      <span>Shop Here</span>
      <span className={styles.shopButtonArrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}