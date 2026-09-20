"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveWellnessPreferences } from "@/backend/actions/profile";
import { WELLNESS_GOALS, PRODUCT_INTERESTS } from "@/types/wellness";
import styles from "./OnboardingFlow.module.css";

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [goals, setGoals] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    );
  }

  async function finish() {
    setLoading(true);
    await saveWellnessPreferences(goals, interests);
    router.push("/profile");
    router.refresh();
  }

  function skip() {
    router.push("/profile");
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.progress}>
        <span className={step === 1 ? styles.dotActive : styles.dot} />
        <span className={step === 2 ? styles.dotActive : styles.dot} />
      </div>

      {step === 1 && (
        <div className={styles.stepContent}>
          <h1 className={styles.heading}>Tell us what you&apos;re looking for 🌿</h1>
          <p className={styles.subtext}>Pick as many as you like.</p>

          <div className={styles.optionsGrid}>
            {WELLNESS_GOALS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => toggle(goals, setGoals, goal)}
                className={
                  goals.includes(goal) ? styles.optionSelected : styles.option
                }
              >
                {goal}
              </button>
            ))}
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={skip} className={styles.skipBtn}>
              Skip for now
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className={styles.nextBtn}
              disabled={goals.length === 0}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={styles.stepContent}>
          <h1 className={styles.heading}>What would you like to explore?</h1>
          <p className={styles.subtext}>Pick as many as you like.</p>

          <div className={styles.optionsGrid}>
            {PRODUCT_INTERESTS.map((product) => (
              <button
                key={product}
                type="button"
                onClick={() => toggle(interests, setInterests, product)}
                className={
                  interests.includes(product)
                    ? styles.optionSelected
                    : styles.option
                }
              >
                {product}
              </button>
            ))}
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={skip} className={styles.skipBtn}>
              Skip for now
            </button>
            <button
              type="button"
              onClick={finish}
              className={styles.nextBtn}
              disabled={loading}
            >
              {loading ? <span className={styles.spinner} /> : "Finish"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}