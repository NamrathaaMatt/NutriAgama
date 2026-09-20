"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/backend/actions/auth";
import PasswordInput from "./PasswordInput";
import styles from "./LoginForm.module.css";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/login");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <PasswordInput
        id="password"
        label="New Password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        showStrength
      />

      <PasswordInput
        id="confirmPassword"
        label="Confirm New Password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
      />

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? <span className={styles.spinner} /> : "Update password"}
      </button>
    </form>
  );
}