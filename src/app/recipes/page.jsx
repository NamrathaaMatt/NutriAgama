"use client";
import { useState } from "react";
import Image from "next/image";
import s from "@/frontend/components/wellness/wellness.module.css";
import { Icon, RecipeCard, fontVars } from "@/frontend/components/wellness/Shared";
import { recipes, categories, products } from "@/lib/wellness-data";

export default function RecipesPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? recipes : recipes.filter((r) => r.cat === filter);
  const cats = ["All", ...categories.map((c) => c.name)];

  return (
    <main className={`${s.page} ${fontVars}`}>
      <section className={s.rhero}>
        <div className={s.inner}>
          <div className={s.rhero}>
            <div>
              <p className={s.eyebrow}>Simple, Wholesome Recipes</p>
              <h1>From Our Kitchen to Yours</h1>
              <p className={s.lead}>
                Traditional recipes made easy. Each one crafted to bring the power of ancient nutrition into your everyday meals.
              </p>
            </div>
            <div className={s.art}>
              <Image 
                src={products[0].img} 
                alt="NutriAgama Products" 
                width={460} 
                height={460}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>

          <div className={s.feats}>
            <div>
              <Icon name="clock" size={28} />
              <span>Quick & Easy</span>
            </div>
            <div>
              <Icon name="leaf" size={28} />
              <span>100% Natural</span>
            </div>
            <div>
              <Icon name="check" size={28} />
              <span>Beginner Friendly</span>
            </div>
            <div>
              <Icon name="wheat" size={28} />
              <span>Nutrient Dense</span>
            </div>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.inner}>
          <div className={s.center}>
            <p className={s.eyebrow}>Filter by meal type</p>
            <div className={s.filters}>
              {cats.map((cat) => (
                <button
                  key={cat}
                  className={s.tab}
                  aria-selected={filter === cat}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className={s.rgrid}>
            {filtered.map((r) => (
              <RecipeCard key={r.slug} r={r} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className={s.center} style={{ marginTop: '48px' }}>
              <p className={s.lead}>No recipes found in this category yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <section className={`${s.section} ${s.sand}`}>
        <div className={s.inner}>
          <div className={s.band}>
            <p className={s.eyebrow} style={{ color: '#e0bd72' }}>Have a recipe idea?</p>
            <h2>Share Your Traditional Recipe</h2>
            <p style={{ maxWidth: '560px', margin: '12px auto 28px' }}>
              We'd love to hear about your family recipes using our products. Share your creations with the NutriAgama community.
            </p>
            <a href="mailto:hello@nutriagama.com" className={`${s.btn} ${s.btnGold}`}>
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
