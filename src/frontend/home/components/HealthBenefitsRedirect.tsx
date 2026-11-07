import styles from "../styles/healthBenefitsRedirect.module.css";
import background from "../assets/backgrounds/bghbredirect.png";

export default function HealthBenefitsRedirect() {
  return (
    <section
      className={styles.section}
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <div className={styles.content}>
        <p className={styles.eyebrow}>ROOTED IN TRADITION</p>

        <h2 className={styles.title}>
          The Goodness
          <br />
          Behind Our Foods
        </h2>

        <p className={styles.description}>
          Discover the traditional ingredients, their
          <br />
          nutritional benefits and how they support
          <br />
          your everyday well-being.
        </p>

        <a href="/health-benefits" className={styles.cta}>
          <span>EXPLORE HEALTH BENEFITS</span>
          <span className={styles.arrow}>→</span>
        </a>
      </div>

      <div className={styles.benefits}>
        <div className={styles.benefit}>
          <div className={styles.icon}>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path d="M34 8C21 10 13 18 14 35" />
              <path d="M14 34C22 32 28 26 31 17" />
              <path d="M22 25C19 23 17 20 16 17" />
            </svg>
          </div>

          <div>
            <h3>
              TRADITIONAL
              <br />
              INGREDIENTS
            </h3>
            <p>
              Time-honoured herbs,
              <br />
              seeds and grains
            </p>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.benefit}>
          <div className={styles.icon}>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path d="M24 38V10" />
              <path d="M24 19C18 18 15 14 15 10C20 11 23 14 24 19Z" />
              <path d="M24 27C30 26 33 22 33 18C28 19 25 22 24 27Z" />
              <path d="M24 34C19 33 16 30 16 26C21 26 23 29 24 34Z" />
            </svg>
          </div>

          <div>
            <h3>
              NUTRITIONAL
              <br />
              BENEFITS
            </h3>
            <p>
              Natural nourishment
              <br />
              for everyday health
            </p>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.benefit}>
          <div className={styles.icon}>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path d="M24 38V12" />
              <path d="M24 19C18 19 15 15 15 10C21 10 24 14 24 19Z" />
              <path d="M24 19C30 19 33 15 33 10C27 10 24 14 24 19Z" />
              <path d="M24 28C19 28 16 25 16 21C21 21 24 24 24 28Z" />
              <path d="M24 28C29 28 32 25 32 21C27 21 24 24 24 28Z" />
            </svg>
          </div>

          <div>
            <h3>
              EVERYDAY
              <br />
              WELLNESS
            </h3>
            <p>
              Simple, wholesome
              <br />
              support for your routine
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}