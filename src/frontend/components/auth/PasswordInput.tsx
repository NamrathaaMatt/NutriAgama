"use client";

import { useState } from "react";
import styles from "./PasswordInput.module.css";

type PasswordInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  showStrength?: boolean;
};

function getStrength(password: string): { label: string; score: number } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Weak", "Fair", "Good", "Strong"];
  return { label: labels[Math.max(score - 1, 0)] ?? "Weak", score };
}

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  autoComplete = "current-password",
  showStrength = false,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const strength = showStrength ? getStrength(value) : null;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className={styles.input}
          required
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className={styles.toggle}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>

      {showStrength && value.length > 0 && strength && (
        <div className={styles.strengthWrapper} aria-live="polite">
          <div className={styles.strengthBar}>
            <div
              className={styles.strengthFill}
              data-score={strength.score}
              style={{ width: `${(strength.score / 4) * 100}%` }}
            />
          </div>
          <span className={styles.strengthLabel}>{strength.label}</span>
        </div>
      )}
    </div>
  );
}