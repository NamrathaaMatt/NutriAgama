"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/backend/actions/auth";
import styles from "./LoginForm.module.css";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await requestPasswordReset(email);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className={styles.form}>
        <p className={styles.footerText} style={{ textAlign: "left" }}>
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a
          password reset link. Check your inbox (and spam folder).
        </p>
        <Link href="/login" className={styles.link}>
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className={styles.input}
          required
        />
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? <span className={styles.spinner} /> : "Send reset link"}
      </button>

      <p className={styles.footerText}>
        Remembered your password?{" "}
        <Link href="/login" className={styles.link}>
          Log in
        </Link>
      </p>
    </form>
  );
}