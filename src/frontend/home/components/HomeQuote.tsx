import Image, { StaticImageData } from "next/image";
import styles from "../styles/home.module.css";

type HomeQuoteProps = {
  quote: StaticImageData;
  alt?: string;
};

export default function HomeQuote({
  quote,
  alt = "",
}: HomeQuoteProps) {
  return (
    <div className={styles.quote}>
      <Image
        className={styles.quoteImage}
        src={quote}
        alt={alt}
        width={900}
        height={500}
        priority
      />
    </div>
  );
}