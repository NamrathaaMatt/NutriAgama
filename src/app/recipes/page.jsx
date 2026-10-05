"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/frontend/components/navbar/Navbar";
import s from "@/frontend/components/wellness/wellness.module.css";
import { Icon, Branch, RecipeCard, fontVars } from "@/frontend/components/wellness/Shared";
import { recipes, categories, products } from "@/lib/wellness-data";

export default function RecipesPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? recipes : recipes.filter((r) => r.cat === filter);
  const cats = ["All", ...categories.map((c) => c.name)];

  return (
    <>
      <Navbar textTone="black" iconTone="black" fixed autoContrast />
      <main className={`${s.page} ${fontVars}`}>
        <section className={s.recipeHero}>
          <div className={s.recipePattern}></div>
          <div className={`${s.inner} ${s.recipeHeroGrid}`}>
            <div className={s.recipeHeroContent}>
              <span className={s.recipePill}>Traditional Recipes · Modern Kitchen</span>
              <h1 className={s.recipeTitle}>Discover Wholesome <span className={s.recipeAccent}>Recipes</span></h1>
              <p className={s.recipeLead}>
                From hearty breakfasts to comforting soups, explore our collection of traditional recipes made simple for your everyday cooking.
              </p>
              <div className={s.recipeStats}>
                <div className={s.recipeStat}>
                <strong>{recipes.length}+</strong>
                <span>Recipes</span>
              </div>
              <div className={s.recipeStat}>
                <strong>{categories.length}</strong>
                <span>Categories</span>
                </div>
                <div className={s.recipeStat}>
                  <strong>100%</strong>
                  <span>Natural</span>
                </div>
              </div>
            </div>
            <div className={s.recipeHeroVisual}>
              <div className={s.recipeCircle}></div>
              <div className={s.recipeProductGrid}>
                {products.slice(0, 4).map((p, i) => (
                  <div key={p.id} className={`${s.recipeProductCard} ${s['rpc' + i]}`}>
                    <img src={p.img} alt={p.name} />
                  </div>
                ))}
              </div>
              <div className={s.recipeFloatingIcons}>
                <div className={s.recipeIcon}><Icon name="clock" size={20} /></div>
                <div className={s.recipeIcon}><Icon name="leaf" size={20} /></div>
                <div className={s.recipeIcon}><Icon name="check" size={20} /></div>
                <div className={s.recipeIcon}><Icon name="wheat" size={20} /></div>
              </div>
            </div>
          </div>
          <div className={s.recipeWave}>
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,64 C360,20 720,100 1080,64 C1260,46 1440,80 1440,80 L1440,120 L0,120 Z" fill="#faf5ea"/>
            </svg>
          </div>
        </section>

        <section className={s.section} style={{ paddingTop: '60px' }}>
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
            <div className={s.band} data-navbar-tone="white">
              <p className={s.eyebrow} style={{ color: '#e0bd72' }}>Have a recipe idea?</p>
              <h2>Share Your Traditional Recipe</h2>
              <p style={{ maxWidth: '560px', margin: '12px auto 28px' }}>
                We'd love to hear about your family recipes using our products. Share your creations with the NutriAgama community.
              </p>
              <Link href="/contact" className={`${s.btn} ${s.btnGold}`}>
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
