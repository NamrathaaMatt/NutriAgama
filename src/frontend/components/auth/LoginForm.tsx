"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logIn } from "@/backend/actions/auth";
import PasswordInput from "./PasswordInput";
import styles from "./LoginForm.module.css";
import GoogleButton from "./GoogleButton";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await logIn({ email, password });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  

  return (
  <form className={styles.form} onSubmit={handleSubmit} noValidate>

    {/* Google Login First */}
    <GoogleButton />

    {/* Divider */}
    <div className={styles.divider}>
      <span>or</span>
    </div>

    {/* Email */}
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

    {/* Password */}
    <PasswordInput
      id="password"
      label="Password"
      value={password}
      onChange={setPassword}
      autoComplete="current-password"
    />

    {/* Remember / Forgot */}
    <div className={styles.row}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Remember me
      </label>

      <Link href="/forgot-password" className={styles.link}>
        Forgot password?
      </Link>
    </div>

    {/* Error */}
    {error && (
      <p className={styles.error} role="alert">
        {error}
      </p>
    )}

    {/* Normal Login */}
    <button
      type="submit"
      className={styles.submitBtn}
      disabled={loading}
    >
      {loading ? <span className={styles.spinner} /> : "Log in"}
    </button>

    {/* Sign up */}
    <p className={styles.footerText}>
      Don&apos;t have an account?{" "}
      <Link href="/signup" className={styles.link}>
        Sign up
      </Link>
    </p>

  </form>
);
}