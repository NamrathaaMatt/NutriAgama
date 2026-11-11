import LoginForm from "@/frontend/components/auth/LoginForm";
import styles from "./page.module.css";

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] | undefined }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;

  return (
    <div className={styles.page}>
      <div className={styles.visualSide}>

        {/* Heritage image */}
        <img
          src="/images/login-heritage.png"
          alt=""
          className={styles.heritageImage}
        />

        {/* Existing green pattern */}
        <div className={styles.pattern} aria-hidden="true" />

        {/* Existing text */}
        <div className={styles.visualContent}>
          <span className={styles.brandMark}>Nutriagama</span>

          <h1 className={styles.headline}>
            Good health,
            <br />
            rooted in tradition.
          </h1>

          <p className={styles.subtext}>
            Everyday nutrition inspired by Karnataka&apos;s timeless food
            wisdom.
          </p>

          <ul className={styles.highlights}>
            <li>Millet Protein</li>
            <li>Moringa Soup</li>
            <li>Methi Balls</li>
            <li>Kashaya</li>
          </ul>
        </div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <h2 className={styles.welcomeHeading}>Welcome back</h2>

          <p className={styles.welcomeSubtext}>
            Log in to continue your wellness journey.
          </p>

          <LoginForm next={next} />
        </div>
      </div>
    </div>
  );
}