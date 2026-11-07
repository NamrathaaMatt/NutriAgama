import Image, { StaticImageData } from "next/image";
import styles from "../styles/home.module.css";

type HomeBackgroundProps = {
  background: StaticImageData;
  alt?: string;
};

export default function HomeBackground({
  background,
  alt = "",
}: HomeBackgroundProps) {
  return (
    <div className={styles.background}>
      <Image
        className={styles.backgroundImage}
        src={background}
        alt={alt}
        fill
        priority
        sizes="100vw"
      />
    </div>
  );
}