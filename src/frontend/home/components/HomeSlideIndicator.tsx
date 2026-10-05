import styles from "../styles/home.module.css";

type HomeSlideIndicatorProps = {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
};

export default function HomeSlideIndicator({
  count,
  activeIndex,
  onSelect,
}: HomeSlideIndicatorProps) {
  return (
    <div
      className={styles.slideIndicator}
      aria-label="Homepage products"
    >
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          className={`${styles.slideIndicatorDot} ${
            index === activeIndex
              ? styles.slideIndicatorDotActive
              : ""
          }`}
          onClick={() => onSelect(index)}
          aria-label={`Show product ${index + 1}`}
          aria-current={index === activeIndex ? "true" : undefined}
        />
      ))}
    </div>
  );
}