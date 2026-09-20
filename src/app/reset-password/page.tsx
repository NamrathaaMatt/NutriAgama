import ResetPasswordForm from "@/frontend/components/auth/ResetPasswordForm";
import styles from "../login/page.module.css";

export default function ResetPasswordPage() {
  return (
    <div className={styles.page}>
      <div className={styles.visualSide}>
        <div className={styles.pattern} aria-hidden="true" />
        <div className={styles.visualContent}>
          <span className={styles.brandMark}>Nutriagama</span>
          <h1 className={styles.headline}>
            Almost
            <br />
            there.
          </h1>
          <p className={styles.subtext}>
            Choose a new password to secure your account.
          </p>
        </div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <h2 className={styles.welcomeHeading}>Set new password</h2>
          <p className={styles.welcomeSubtext}>
            Make it something you&apos;ll remember.
          </p>
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}