"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "./about.css";
import { FiInstagram, FiFacebook, FiTwitter } from "react-icons/fi";

const roots = [
  { emoji: "🌰", tag: "Ayurvedic Staple", title: "Almonds Soaked Overnight", text: "A practice rooted in Ayurvedic wisdom — soaking releases enzymes that unlock nutrients and make digestion effortless." },
  { emoji: "🌱", tag: "Ancient Grain", title: "Sprouted Grains", text: "Sprouting unlocks proteins, minerals and vitamins locked inside grains, making them far easier to digest and more nourishing." },
  { emoji: "🍃", tag: "Farm Grown", title: "Moringa Leaves", text: "Called the Miracle Tree for centuries. Dense with vitamins, minerals and antioxidants. We grow it on our own farm." },
  { emoji: "🌾", tag: "Kitchen Wisdom", title: "Methi Seeds", text: "Fenugreek has been a trusted kitchen staple for centuries — known to support digestion and provide steady warmth from within." },
  { emoji: "✨", tag: "Omega Rich", title: "Dry Seeds Mix", text: "A carefully curated blend of pumpkin, sunflower and flax seeds providing omega fatty acids and essential minerals." },
  { emoji: "🫚", tag: "Traditional Brew", title: "Kashaya Herbs", text: "A warming blend of cinnamon, ginger, cardamom and pepper — traditionally brewed to start the day with clarity." },
];

const beliefs = [
  { icon: "🌱", title: "Growth is not just about height.", text: "Real growth is built quietly — in the body's cells, in the mind's clarity, in the consistency of nourishment over years." },
  { icon: "⚡", title: "Energy is not just about an instant boost.", text: "Sustainable energy comes from real food — proteins, fats, and complex carbohydrates working together the way nature designed." },
  { icon: "🕰️", title: "Health is not built in a day.", text: "It is built quietly... daily... over time. This is why we focus on ingredients you can take every single day, without worry." },
  { icon: "🏺", title: "Real food is the oldest medicine.", text: "Our grandparents built strength not from supplements, but from simple, honest food. We went back to find out why." },
];

const commitments = [
  "A nutrition that fits into real life.",
  "A product that parents can trust without doubt.",
  "A habit that children can carry for years.",
];

const approach = [
  {
    title: "No Shortcuts",
    text: "Every ingredient earns its place through decades of traditional use and modern nutritional understanding.",
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="28" stroke="#4b5a3a" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="16" y1="16" x2="48" y2="48" stroke="#a85c37" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="32" r="14" stroke="#4b5a3a" strokeWidth="1.5" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: "No Unnecessary Additives",
    text: "Nothing artificial ever enters our blends. If your grandmother would not recognise it, it does not belong.",
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 8 C32 8 20 20 20 34 C20 44 25 52 32 52 C39 52 44 44 44 34 C44 20 32 8 32 8Z" stroke="#4b5a3a" strokeWidth="1.5" fill="rgba(75,90,58,.07)" />
        <path d="M32 20 C32 20 26 28 26 36 C26 41 28.5 46 32 46" stroke="#a85c37" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="32" cy="34" r="3" fill="#a85c37" opacity="0.7" />
      </svg>
    ),
  },
  {
    title: "No Artificial Promises",
    text: "We do not claim overnight miracles. We promise consistent, gentle, real nourishment — the kind that lasts.",
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 32 Q22 20 32 32 Q42 44 52 32" stroke="#4b5a3a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 44 Q22 32 32 44 Q42 56 52 44" stroke="#a85c37" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <circle cx="32" cy="32" r="4" fill="#4b5a3a" opacity="0.8" />
      </svg>
    ),
  },
  {
    title: "Just Real Food, Thoughtfully Combined",
    text: "Nuts for strength, seeds for balance, sprouted grains for growth — combined not just for taste, but for complete, everyday nourishment.",
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="32" cy="44" rx="18" ry="8" stroke="#4b5a3a" strokeWidth="1.5" fill="rgba(75,90,58,.07)" />
        <path d="M14 44 L14 36 Q14 20 32 16 Q50 20 50 36 L50 44" stroke="#4b5a3a" strokeWidth="1.5" />
        <path d="M22 36 Q27 30 32 34 Q37 38 42 32" stroke="#a85c37" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="32" cy="16" r="3" fill="#a85c37" opacity="0.7" />
      </svg>
    ),
  },
];

// small helper — generates a fixed set of drifting particles client-side only,
// after mount, so server and client HTML never disagree on the random values
function useParticles(count, opts = {}) {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: count }, () => ({
        left: 5 + Math.random() * 90,
        dx: Math.random() * 60 - 30,
        duration: (opts.minDur || 7) + Math.random() * (opts.durRange || 8),
        delay: Math.random() * (opts.maxDelay || 8),
        size: (opts.minSize || 3) + Math.random() * (opts.sizeRange || 5),
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);
  return particles;
}

export default function AboutUs() {
  const heroTextRef = useRef(null);
  const heroParticles = useParticles(10);
  const ashParticles = useParticles(8, { minDur: 6, durRange: 6, maxDelay: 6, minSize: 2, sizeRange: 4 });
  const [openFounder, setOpenFounder] = useState(null);

  // beliefs: "one truth at a time" — active truth, typewriter progress, in-view flag
  const beliefsRef = useRef(null);
  const [truth, setTruth] = useState(0);
  const [typed, setTyped] = useState(beliefs[0].title.length);
  const [beliefsActive, setBeliefsActive] = useState(false);

  // On mobile the founder cards are plain static content (photo + caption + bio
  // all in normal flow) — there is no tap interaction there at all, so this
  // never changes state on small screens, and nothing can flicker/vanish.
  function handleFounderTap(i) {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 560px)").matches) return;
    setOpenFounder((prev) => (prev === i ? null : i));
  }

  useEffect(() => {
    const selectors = [".reveal", ".reveal-left", ".reveal-right"];
    const observers = selectors.map((sel) => {
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
        { threshold: 0.12 }
      );
      document.querySelectorAll(sel).forEach((el) => obs.observe(el));
      return obs;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // only run the beliefs autoplay while the section is on screen
  useEffect(() => {
    if (!beliefsRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setBeliefsActive(entry.isIntersecting),
      { threshold: 0.35 }
    );
    obs.observe(beliefsRef.current);
    return () => obs.disconnect();
  }, []);

  // typewriter + autoplay to the next truth (no autoplay for reduced-motion users)
  useEffect(() => {
    const full = beliefs[truth].title.length;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(full);
      return;
    }
    if (!beliefsActive) return;
    setTyped(0);
    let c = 0;
    const iv = setInterval(() => {
      c += 1;
      setTyped(c);
      if (c >= full) clearInterval(iv);
    }, 32);
    const next = setTimeout(() => setTruth((t) => (t + 1) % beliefs.length), 5000);
    return () => { clearInterval(iv); clearTimeout(next); };
  }, [truth, beliefsActive]);

  function handleHeroMove(e) {
    if (!heroTextRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroTextRef.current.style.transform = `translate(${x * 10}px, ${y * 8}px)`;
  }
  function resetHeroMove() {
    if (heroTextRef.current) heroTextRef.current.style.transform = "";
  }

  return (
    <div className="about-page">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="about-hero" onMouseMove={handleHeroMove} onMouseLeave={resetHeroMove}>
        <video className="about-hero__video" autoPlay muted loop playsInline src="/about-video.mp4" />
        <div className="about-hero__overlay" />
        <div className="about-hero__particles" aria-hidden="true">
          {heroParticles.map((p, i) => (
            <span key={i} className="hero-particle" style={{ left: `${p.left}%`, width: p.size, height: p.size, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`, "--dx": `${p.dx}px` }} />
          ))}
        </div>
        <div className="about-hero__content" ref={heroTextRef}>
          <span className="about-hero__eyebrow">Our Story · Aruva Agama · Siri Nutri</span>
          <h1 className="about-hero__heading">
            <span className="hero-line"><span>From <span className="hero-underline">real fields<svg viewBox="0 0 160 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 7 Q 45 2, 80 7 T 158 6" /></svg></span></span></span>
            <span className="hero-line"><span>to real families.</span></span>
          </h1>
          <p className="about-hero__sub">
            In today's world, nutrition has become complicated. We moved away from something real. So we went back to our roots.
          </p>
          <p className="about-hero__tagline">"Ancient Nutrition for Modern Life"</p>
        </div>
        <div className="about-hero__scroll" aria-hidden="true">
          <div className="about-hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── ORIGIN STORY ─────────────────────────────────── */}
      <section className="about-origin">
        <div className="about-container">
          <div className="about-origin__grid">
            <div className="reveal-left">
              <span className="about-origin__eyebrow">Where It Began</span>
              <h2 className="about-origin__heading">
                We started with one<br /><em>simple question.</em>
              </h2>
              <div className="about-origin__body">
                <p>
                  "Why can't daily nutrition come from real ingredients — the same ones our families have trusted for generations?" Not from laboratories. Not from synthetic blends. But from nature itself.
                </p>
                <p>
                  So we went back to our roots. To almonds soaked overnight. To seeds that nourish quietly. To sprouted grains that have been part of Indian kitchens for centuries.
                </p>
                <p>
                  We looked at how our grandparents built strength — not from supplements, but from simple, honest food. That's how our nutrition mix was born: nuts for strength, seeds for balance, sprouted grains for growth — combined not just for taste, but for complete, everyday nourishment.
                </p>
              </div>
            </div>
            <div className="about-origin__visual reveal-right">
              <div className="about-origin__circle">
                <div className="story-center-text">
                  <span>Est. with</span>
                  <strong>Purpose</strong>
                  <em>Farm to Family</em>
                </div>
              </div>
              <div className="about-origin__icons">
                {[
                  { emoji: "🌰", label: "Almonds" },
                  { emoji: "🌱", label: "Sprouted Grains" },
                  { emoji: "🍃", label: "Moringa" },
                  { emoji: "🌾", label: "Methi" },
                  { emoji: "✨", label: "Seeds Mix" },
                  { emoji: "🫚", label: "Kashaya" },
                ].map((item, i) => (
                  <div key={i} className="story-icon">
                    <div className="story-icon__inner">
                      <div className="story-icon__emoji">{item.emoji}</div>
                      <span className="story-icon__label">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMITMENTS ──────────────────────────────────── */}
      <section className="about-commitments">
        <div className="about-container">
          <div className="commitments-list">
            <div className="commitments-spine reveal" aria-hidden="true" />
            {commitments.map((c, i) => (
              <div key={i} className="commitment-item reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                <span className="commitment-dot" />
                <p>{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO INTERLUDE ───────────────────────────────── */}
      <section className="about-video-section">
        <video className="about-video-section__video" autoPlay muted loop playsInline src="/about-video.mp4" />
        <div className="about-video-section__overlay" />
        <div className="about-video-section__particles" aria-hidden="true">
          {ashParticles.map((p, i) => (
            <span key={i} className="ash-particle" style={{ left: `${p.left}%`, width: p.size, height: p.size, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`, "--dx": `${p.dx}px` }} />
          ))}
        </div>
        <div className="about-video-section__content">
          <p className="about-video-section__quote reveal">
            "Why can't daily nutrition come from real ingredients — the same ones our families have trusted for generations?"
          </p>
          <span className="about-video-section__attr reveal" style={{ transitionDelay: "0.2s" }}>
            — Aruva Agama · Siri Nutri
          </span>
        </div>
      </section>

      {/* ── BELIEFS ──────────────────────────────────────── */}
      <section className="about-beliefs" ref={beliefsRef}>
        <div className="about-container">
          <div className="section-header reveal">
            <span className="section-eyebrow">Because We Believe</span>
            <h2 className="section-heading">Four truths that <em>guide everything</em> we do.</h2>
          </div>
          <div className="belief-stage reveal">
            <div className="belief-rail" role="tablist" aria-label="Our four beliefs">
              {beliefs.map((b, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={truth === i}
                  className={`belief-rail__item ${truth === i ? "is-on" : ""}`}
                  onClick={() => setTruth(i)}
                >
                  <span className="belief-rail__icon">{b.icon}</span>
                  <span className="belief-rail__num">0{i + 1}</span>
                  {truth === i && beliefsActive && (
                    <span key={`${truth}-bar`} className="belief-rail__bar" />
                  )}
                </button>
              ))}
            </div>
            <div className="belief-say" role="tabpanel" aria-label={beliefs[truth].title}>
              <p className="belief-say__title">
                <span aria-hidden="true">{beliefs[truth].title.slice(0, typed)}</span>
                <span className="belief-say__caret" aria-hidden="true" />
                <span className="belief-say__rest" aria-hidden="true">{beliefs[truth].title.slice(typed)}</span>
              </p>
              <p className={`belief-say__text ${typed >= beliefs[truth].title.length ? "is-shown" : ""}`}>
                {beliefs[truth].text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROOTS ────────────────────────────────────────── */}
      <section className="about-roots">
        <div className="about-container">
          <div className="section-header reveal">
            <span className="section-eyebrow">So We Went Back</span>
            <h2 className="section-heading">To the ingredients your<br /><em>grandmother trusted.</em></h2>
          </div>
          <div className="roots-grid">
            {roots.map((r, i) => (
              <div key={i} className={`roots-card ${i % 3 === 0 ? "reveal-left" : i % 3 === 2 ? "reveal-right" : "reveal"}`} style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
                <div className="roots-card__fill" />
                <span className="roots-card__num">0{i + 1}</span>
                <div className="roots-card__body">
                  <div className="roots-card__pill">
                    <span>{r.emoji}</span>
                    <span>{r.tag}</span>
                  </div>
                  <h3 className="roots-card__title">{r.title}</h3>
                  <p className="roots-card__text">{r.text}</p>
                </div>
                <div className="roots-card__tag">Ingredient</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ──────────────────────────────────────── */}
      <section className="about-mission">
        <div className="about-container">
          <div className="mission-stages-wrap reveal">
            <svg className="mission-connector" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="1" x2="100%" y2="1" /></svg>
            <div className="mission-stages">
              {["A child's first steps", "A teenager's active years", "An adult's busy life"].map((s, i) => (
                <span key={i} className={`mission-stage ${i === 1 ? "active" : ""}`}>{s}</span>
              ))}
            </div>
          </div>
          <p className="mission-tagline reveal" style={{ transitionDelay: "0.1s" }}>
            Our mission is to support nutrition at every stage — <em>naturally</em>.
          </p>
          <p className="mission-promise reveal" style={{ transitionDelay: "0.25s" }}>
            "To bring back the power of real food into everyday nutrition — for <em>stronger bodies</em>, sharper minds, and healthier lives."
          </p>
          <div className="mission-pills reveal" style={{ transitionDelay: "0.4s" }}>
            {["Not a Supplement", "Not a Shortcut", "Just Real Nutrition", "The Way It Should Be"].map((t, i) => (
              <span key={i} className="mission-pill" style={{ transitionDelay: `${0.4 + i * 0.08}s` }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPROACH ─────────────────────────────────────── */}
      <section className="about-approach">
        <div className="about-container">
          <div className="section-header reveal">
            <span className="section-eyebrow">Our Approach Is Simple</span>
            <h2 className="section-heading">No shortcuts.<br /><em>No compromises.</em></h2>
          </div>
          <div className="approach-grid">
            {approach.map((a, i) => (
              <div key={i} className="approach-card reveal" style={{ transitionDelay: `${i * 0.12}s`, "--i": i }}>
                <span className="approach-card__number">0{i + 1}</span>
                <div className="approach-card__icon-wrap">{a.svg}</div>
                <h3 className="approach-card__title">{a.title}</h3>
                <p className="approach-card__text">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDERS ─────────────────────────────────────── */}
      <section className="about-founders">
        <div className="about-container">
          <div className="section-header reveal">
            <span className="section-eyebrow">The People Behind It</span>
            <h2 className="section-heading">Meet the <em>founders</em><br />who started it all.</h2>
          </div>
          <div className="founders-grid">
            <div
              className={`founder-card founder-card--primary reveal-left ${openFounder === 0 ? "is-open" : ""}`}
              onClick={() => handleFounderTap(0)}
            >
              <div className="founder-card__img">
                <Image src="/founder-veena.jpg" alt="Ms. Veena" fill sizes="(max-width: 700px) 100vw, 50vw" unoptimized style={{ objectFit: "contain", objectPosition: "center" }} />
              </div>
              <div className="founder-card__scrim" />
              <span className="founder-card__badge">✦ Founder</span>
              <div className="founder-card__caption">
                <h3 className="founder-card__name">Ms. Veena</h3>
                <p className="founder-card__role">Aruva Agama Siri Nutri</p>
                <span className="founder-card__hint">Tap to read more</span>
              </div>
              <div className="founder-card__bio-panel">
                <h3 className="founder-card__name founder-card__name--panel">Ms. Veena</h3>
                <p className="founder-card__role">Aruva Agama Siri Nutri</p>
                <p className="founder-card__bio">
                  A believer in the power of the Indian kitchen, Ms. Veena's vision was born from years of watching traditional recipes nourish entire generations. She brought ancient wisdom into a modern, everyday format — ensuring every blend carries the warmth of a grandmother's recipe.
                </p>
              </div>
            </div>

            <div
              className={`founder-card reveal-right ${openFounder === 1 ? "is-open" : ""}`}
              onClick={() => handleFounderTap(1)}
            >
              <div className="founder-card__img">
                <Image src="/founder-kiran.jpg" alt="Mr. Kiran" fill sizes="(max-width: 700px) 100vw, 50vw" unoptimized style={{ objectFit: "contain", objectPosition: "center" }} />
              </div>
              <div className="founder-card__scrim" />
              <span className="founder-card__badge">Co-Founder</span>
              <div className="founder-card__caption">
                <h3 className="founder-card__name">Mr. Kiran</h3>
                <p className="founder-card__role">Aruva Agama Siri Nutri</p>
                <span className="founder-card__hint">Tap to read more</span>
              </div>
              <div className="founder-card__bio-panel">
                <h3 className="founder-card__name founder-card__name--panel">Mr. Kiran</h3>
                <p className="founder-card__role">Aruva Agama Siri Nutri</p>
                <p className="founder-card__bio">
                  Mr. Kiran built the farm-to-family bridge — ensuring every ingredient is grown on their own land, harvested at the right time, and processed without shortcuts. His commitment to quality means what's in the pack is exactly what you see on the label.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROMISE ──────────────────────────────────────── */}
      <section className="about-promise">
        <div className="about-container">
          <p className="promise-quote reveal">
            "We did not want to create another <em>health drink</em>.<br />We wanted to create something different."
          </p>
          <p className="promise-attr reveal" style={{ transitionDelay: "0.2s" }}>
            — Aruva Agama · Siri Nutri · 
          </p>
          <div className="promise-pills reveal" style={{ transitionDelay: "0.3s" }}>
            {["🌱 Organically grown", "🚫 No artificial ingredients", "🏺 Generations of knowledge", "🔬 Science-backed", "🌾 Farm to family"].map((p, i) => (
              <span key={i} className="promise-pill" style={{ transitionDelay: `${0.3 + i * 0.07}s` }}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="about-footer">
        <div className="about-container">
          <div className="about-footer__inner">
            <div className="about-footer__brand">
              <h3 className="about-footer__logo">Nutri Agama</h3>
              <p className="about-footer__tagline">Ancient Nutrition for Modern Life</p>
              <div className="about-footer__social">
                <a href="#" aria-label="Instagram"><FiInstagram size={18} /></a>
                <a href="#" aria-label="Facebook"><FiFacebook size={18} /></a>
                <a href="#" aria-label="Twitter"><FiTwitter size={18} /></a>
              </div>
            </div>
            <div className="about-footer__links">
              <h4>Explore</h4>
              <a href="/shop">Shop</a>
              <a href="/about-us">About Us</a>
              <a href="/health-benefits">Health Benefits</a>
              <a href="/contact-us">Contact Us</a>
            </div>
            <div className="about-footer__links">
              <h4>Products</h4>
              <a href="/shop">Protein Powder</a>
              <a href="/shop">Kashaya Powder</a>
              <a href="/shop">Moringa Leaf Soup</a>
              <a href="/shop">Methi Balls</a>
            </div>
            <div className="about-footer__contact">
              <h4>Get In Touch</h4>
              <p>aruyaagamasirinutri55@gmail.com</p>
              <p>+91 80731 40054</p>
              <p>+91 90365 72176</p>
              <a href="/contact-us" className="about-footer__contact-btn">Contact Us</a>
            </div>
          </div>
          <div className="about-footer__bottom">
            <p>© {new Date().getFullYear()} Aruva Agama Siri Nutri. All rights reserved.</p>
            <p>Made with intention and real ingredients.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}