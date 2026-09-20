import ForgotPasswordForm from "@/frontend/components/auth/ForgotPasswordForm";
import styles from "../login/page.module.css";

export default function ForgotPasswordPage() {
  return (
    <div className={styles.page}>
      <div className={styles.visualSide}>
        <div className={styles.pattern} aria-hidden="true" />
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
        </div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <h2 className={styles.welcomeHeading}>Reset your password</h2>
          <p className={styles.welcomeSubtext}>
            Enter your email and we&apos;ll send you a reset link.
          </p>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}