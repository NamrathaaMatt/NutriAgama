"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/frontend/components/navbar/Navbar";
import s from "@/frontend/components/wellness/wellness.module.css";
import { Icon, Branch, RecipeCard, fontVars } from "@/frontend/components/wellness/Shared";
import { benefits, products, recipes } from "@/lib/wellness-data";

const MARQ = ["100% Natural", "No Artificial Additives", "Farm Fresh", "Ancient Nutrition", "Karnataka Tradition"];
const FROM = [["millet"], ["moringa", "kashaya"], ["millet"], ["millet"], ["moringa"], ["methi"], ["kashaya"], ["moringa", "methi"]];
const LEAVES = [[27, 10, -30, 1.1, 0, 0], [66, 6, 40, 0.8, 1, 2], [22, 50, 150, 1.3, 0, 0], [72, 68, -20, 1.4, 1, 3], [40, 86, 80, 0.9, 0, 0], [60, 24, 200, 0.7, 1, 1], [80, 28, 110, 1, 0, 2]];
function Leaf({ x, y, r, z, c, b, i }) {
  return (
    <svg className={s.leaf} viewBox="0 0 80 44" style={{ left: x + "%", top: y + "%", "--r": r + "deg", "--z": z, "--i": i, filter: b ? `blur(${b}px)` : undefined }} aria-hidden="true">
      <path d="M0 40C8 12 46 0 78 4 76 34 42 56 0 40z" fill={c} />
      <path d="M2 39C24 26 48 14 74 6" stroke="rgba(255,255,255,.45)" strokeWidth="1.2" fill="none" />
    </svg>
  );
}
const byId = Object.fromEntries(products.map((p) => [p.id, p]));

export default function HealthBenefitsPage() {
  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [bi, setBi] = useState(0);
  const [bPaused, setBPaused] = useState(false);

  useEffect(() => {
    const a = setTimeout(() => setLeaving(true), 2800);
    const b = setTimeout(() => { setIdx((i) => (i + 1) % products.length); setLeaving(false); }, 3200);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [idx]);

  useEffect(() => {
    if (bPaused) return;
    const t = setTimeout(() => setBi((i) => (i + 1) % benefits.length), 5000);
    return () => clearTimeout(t);
  }, [bi, bPaused]);

  const p = products[idx];
  const b = benefits[bi];

  const changeProduct = (direction) => {
    setLeaving(true);
    setTimeout(() => {
      setIdx((i) => (i + direction + products.length) % products.length);
      setLeaving(false);
    }, 320);
  };

  return (
    <>
      <Navbar textTone="black" iconTone="black" fixed autoContrast />
      <main className={`${s.page} ${fontVars}`} style={{ paddingTop: '0' }}>
      {/* HERO */}
      <section className={`${s.hero} ${s.grain}`} data-navbar-tone="white">
        <div className={s.glow} />
        <Branch className={`${s.br} ${s.brL}`} /><Branch className={`${s.br} ${s.brR}`} flip />
        <div className={`${s.inner} ${s.heroGrid}`}>
          <div>
            <span className={s.pill}>Ancient nutrition for modern life</span>
            <h1>The Power of <em>Real Food</em></h1>
            <p className={s.lead}>Discover how traditional Karnataka food wisdom meets everyday wellness — naturally nourishing stronger bodies, sharper minds, and healthier lives.</p>
            <div className={s.actions}>
              <a href="#products" className={s.btn}>Explore products</a>
              <Link href="/recipes" className={`${s.btn} ${s.ghost}`}>Browse recipes</Link>
            </div>
          </div>
          <div className={s.collage} aria-hidden="true">
            <div className={s.disc} />
            <div className={s.floor} />
            <div className={s.hps}>
              <img className={`${s.hp} ${s.hpL}`} src={byId.moringa.img} alt="" />
              <img className={`${s.hp} ${s.hpC}`} src={byId.millet.img} alt="" />
              <img className={`${s.hp} ${s.hpR}`} src={byId.kashaya.img} alt="" />
            </div>
          </div>
        </div>
        <div className={s.heroDivider}>
          <div className={s.dividerLine}></div>
          <div className={s.dividerDots}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section id="products" className={s.stagewrap} style={{ "--tint": p.tint }} data-navbar-tone="black">
        <div className={s.inner}>
          <p className={s.center}><span className={s.spill}><b>0{idx + 1}</b> What&apos;s inside matters</span></p>
          <div key={p.id + "t"} className={s.center} style={{ animation: "fadeup .7s both", marginTop: 22 }}>
            <h2 className={s.pname}>{p.name}</h2>
            <p className={s.tag}>{p.tag}</p>
            <div className={s.productControls} aria-label="Product showcase controls">
              <button type="button" className={s.productControl} onClick={() => changeProduct(-1)} aria-label="Previous product">←</button>
              <span aria-live="polite">{idx + 1} / {products.length}</span>
              <button type="button" className={s.productControl} onClick={() => changeProduct(1)} aria-label="Next product">→</button>
            </div>
          </div>
          <div className={s.arena}>
            <div className={s.rings}><i /><i /><i /></div>
            {LEAVES.map(([x, y, r, z, c, b2], i) => (
              <Leaf key={p.id + i} x={x} y={y} r={r} z={z} c={p.leaf[c]} b={i % 3 === 2 ? 2 : 0} i={b2} />
            ))}
            <div className={s.spot}>
              <img key={p.id} className={`${s.pimg2} ${leaving ? s.out : s.inn}`} src={p.img} alt={p.name} />
            </div>
            {p.hl.map(([v, t, d], i) => (
              <div key={p.id + i} className={`${s.hcard} ${s["hc" + i]}`}><b>{v}</b><strong>{t}</strong><span>{d}</span></div>
            ))}
          </div>
          <p className={s.sdesc} key={p.id + "d"}>{p.desc}</p>
        </div>
      </section>

      {/* WHY OUR PRODUCTS WORK */}
      <section className={`${s.section} ${s.why} ${s.grain}`} data-navbar-tone="black">
        <div className={s.glow} />
        <Branch className={`${s.br} ${s.brDark} ${s.brR}`} />
        <div className={s.inner}>
          <div className={s.center}>
            <p className={s.eyebrow}>Why our products work</p>
            <h2 className={s.h2}>Rooted in tradition,<br />backed by science</h2>
            <p className={s.lead}>Science-backed benefits rooted in centuries of traditional wisdom.</p>
          </div>
          <div className={s.bx} onMouseEnter={() => setBPaused(true)} onMouseLeave={() => setBPaused(false)}>
            <ol className={s.blist}>
              {benefits.map((x, i) => (
                <li key={x.title}><button className={i === bi ? s.bon : ""} onClick={() => setBi(i)} onMouseEnter={() => setBi(i)}><em>0{i + 1}</em>{x.title}</button></li>
              ))}
            </ol>
            <div className={s.bpanel} key={bi}>
              <span className={s.bnum}>0{bi + 1}</span>
              <div className={s.bicon}><Icon name={b.icon} size={54} /></div>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
              <div className={s.bfrom}>
                <span>Found in</span>
                {FROM[bi].map((id) => (<b key={id}><img src={byId[id].img} alt="" />{byId[id].name}</b>))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECIPES */}
      <section className={s.section}>
        <div className={s.inner}>
          <div className={s.center}>
            <p className={s.eyebrow}>From our kitchen</p>
            <h2 className={s.h2}>Simple recipes to get started</h2>
            <p className={s.lead}>Easy ways to incorporate ancient nutrition into your daily routine.</p>
          </div>
          <div className={s.rgrid}>{recipes.filter((r) => ["golden-millet-protein-smoothie", "moringa-immunity-bowl", "traditional-methi-ladoo"].includes(r.slug)).map((r) => <RecipeCard key={r.slug} r={r} />)}</div>
          <div className={s.ctaRow}><Link href="/recipes" className={s.btn}>Explore more recipes</Link></div>
        </div>
      </section>
    </main>
    </>
  );
}
