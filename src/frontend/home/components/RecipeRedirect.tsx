"use client";

import { useRouter } from "next/navigation";
import styles from "../styles/recipeRedirect.module.css";

export default function RecipeRedirect() {
  const router = useRouter();

  const handleExplore = () => {
    router.push("/recipes");
  };

  return (
    <section className={styles.recipeSection}>
      <div className={styles.background} />

      <div className={styles.content}>
        <div className={styles.eyebrow}>
          <span className={styles.line} />
          <span>RECIPES</span>
        </div>

        <h2>
          From Tradition
          <br />
          to Table
        </h2>

        <p>
          Simple, nourishing recipes made with
          <br />
          real ingredients, rooted in our traditional
          <br />
          wisdom.
        </p>

        <button
          type="button"
          className={styles.exploreButton}
          onClick={handleExplore}
        >
          <span>EXPLORE RECIPES</span>
          <span className={styles.arrow}>→</span>
        </button>
      </div>
    </section>
  );
}