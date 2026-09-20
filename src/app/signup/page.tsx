import SignupForm from "@/frontend/components/auth/SignupForm";
import styles from "./page.module.css";

export default function SignupPage() {
  return (
    <div className={styles.page}>
      <div className={styles.visualSide}>
        <div className={styles.pattern} aria-hidden="true" />
        <div className={styles.visualContent}>
          <span className={styles.brandMark}>Nutriagama</span>
          <h1 className={styles.headline}>
            Begin your
            <br />
            wellness journey.
          </h1>
          <p className={styles.subtext}>
            Join a community rediscovering Karnataka&apos;s food wisdom, made
            for modern life.
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
          <h2 className={styles.welcomeHeading}>Create your account</h2>
          <p className={styles.welcomeSubtext}>
            A few details to get you started.
          </p>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}