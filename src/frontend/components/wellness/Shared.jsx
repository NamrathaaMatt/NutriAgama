import { Cormorant_Garamond, Manrope } from "next/font/google";
import s from "./wellness.module.css";

const head = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-head" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });
export const fontVars = `${head.variable} ${body.variable}`;

const paths = {
  strength: "M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11",
  shield: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4",
  leaf: "M5 19c0-8 5-14 14-14 0 9-6 14-14 14zM5 19l8-8",
  bolt: "M13 3L5 14h6l-1 7 8-11h-6z",
  sun: "M8 12a4 4 0 108 0 4 4 0 10-8 0M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4",
  balance: "M12 4v16M6 20h12M5 8h14M5 8l-3 6a3 3 0 006 0zM19 8l-3 6a3 3 0 006 0z",
  flame: "M12 3c1 4 5 6 5 11a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z",
  drop: "M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z",
  clock: "M3 12a9 9 0 1018 0 9 9 0 10-18 0M12 7v5l3 2",
  check: "M5 12l4 4 10-10",
  wheat: "M12 21V8M12 8c-3 0-4-2-4-4 3 0 4 2 4 4zM12 8c3 0 4-2 4-4-3 0-4 2-4 4zM12 14c-3 0-4-2-4-4 3 0 4 2 4 4zM12 14c3 0 4-2 4-4-3 0-4 2-4 4z",
};

export function Icon({ name, size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

export function RecipeCard({ r }) {
  return (
    <article className={s.rcard}>
      <div className={s.rtop}>
        <span className={s.badge}>{r.cat}</span>
        <div className={s.dish} aria-hidden="true">
          <Dish kind={r.art} />
        </div>
      </div>
      <div className={s.rbody}>
        <h3>{r.title}</h3>
        <p className={s.meta}>
          <span><Icon name="clock" size={16} /> {r.time}</span>
          <span><Icon name="leaf" size={16} /> {r.product.name}</span>
        </p>
        <p>{r.blurb}</p>
        <details>
          <summary>View recipe</summary>
          <h4>Ingredients</h4>
          <ul>{r.ingredients.map((i) => <li key={i}>{i}</li>)}</ul>
          <h4>Method</h4>
          <ol>{r.steps.map((t) => <li key={t}>{t}</li>)}</ol>
        </details>
      </div>
    </article>
  );
}

export function Branch({ className, flip }) {
  return (
    <svg className={className} style={flip ? { transform: "scaleX(-1)" } : undefined} viewBox="0 0 300 520" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M150 520C138 400 172 260 150 24" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={i} transform={`translate(${i % 2 ? 144 : 154} ${470 - i * 62}) scale(${1 - i * 0.07})`}>
          <path d="M0 0c30-44 90-52 124-16-30 42-88 52-124 16z" transform="rotate(-18)" fill="currentColor" fillOpacity=".09" />
          <path d="M0 0c-30-44-90-52-124-16 30 42 88 52 124 16z" transform="rotate(18)" fill="currentColor" fillOpacity=".09" />
        </g>
      ))}
    </svg>
  );
}

const arts = {
  shake: <><path d="M30 32h40l-5 54H35z" fill="#e9cf9a" /><path d="M32 32h36l-1.5 14h-33z" fill="#fff" /><path d="M58 32l9-20" stroke="#b98d3c" strokeWidth="4" /><path d="M36 60h28" stroke="#c9a24a" strokeWidth="3" /></>,
  choco: <><rect x="22" y="30" width="56" height="42" rx="5" fill="#5a3421" /><path d="M36 30v42M50 30v42M64 30v42M22 44h56M22 58h56" stroke="#3a2013" strokeWidth="2" /><path d="M22 72l8 8h48l-2-8z" fill="#c9a24a" /></>,
  cake: <><path d="M18 72V46l64-14v40z" fill="#e8c98a" /><path d="M18 58l64-14" stroke="#fff" strokeWidth="6" /><path d="M18 46l64-14v9L18 55z" fill="#5a3421" /><ellipse cx="50" cy="76" rx="38" ry="5" fill="#d8ccb0" /></>,
  soup: <><path d="M16 48h68c0 24-15 36-34 36S16 72 16 48z" fill="#1c3b29" /><ellipse cx="50" cy="48" rx="34" ry="7" fill="#8fb35e" /><path d="M38 34c-4-6 4-8 0-14M52 34c-4-6 4-8 0-14M66 34c-4-6 4-8 0-14" stroke="#b98d3c" strokeWidth="2.5" strokeLinecap="round" fill="none" /></>,
  cup: <><path d="M24 42h44v20a18 18 0 01-18 18h-8a18 18 0 01-18-18z" fill="#b98d3c" /><path d="M68 48h6a8 8 0 010 16h-6" stroke="#b98d3c" strokeWidth="4" fill="none" /><ellipse cx="46" cy="42" rx="22" ry="4" fill="#8a4b2d" /><path d="M38 30c-4-6 4-8 0-14M52 30c-4-6 4-8 0-14" stroke="#c9a24a" strokeWidth="2.5" strokeLinecap="round" fill="none" /></>,
  bowl: <><path d="M16 46h68c0 24-15 38-34 38S16 70 16 46z" fill="#b98d3c" /><ellipse cx="50" cy="46" rx="34" ry="8" fill="#f3e6c8" /><circle cx="40" cy="45" r="3" fill="#8a4b2d" /><circle cx="56" cy="47" r="3" fill="#8a4b2d" /><circle cx="64" cy="43" r="2.5" fill="#5f8f4a" /></>,
  stack: <><ellipse cx="50" cy="70" rx="34" ry="9" fill="#c9a24a" /><ellipse cx="50" cy="60" rx="34" ry="9" fill="#e0b85a" /><ellipse cx="50" cy="50" rx="34" ry="9" fill="#c9a24a" /><ellipse cx="50" cy="40" rx="34" ry="9" fill="#e0b85a" /><path d="M30 40c6 10 10 4 14 14" stroke="#8a4b2d" strokeWidth="4" strokeLinecap="round" fill="none" /></>,
  ladoo: <><circle cx="34" cy="62" r="19" fill="#a86a3a" /><circle cx="66" cy="62" r="19" fill="#8a4b2d" /><circle cx="50" cy="36" r="19" fill="#c08240" /><circle cx="44" cy="30" r="5" fill="#fff" opacity=".25" /></>,
};
export function Dish({ kind }) {
  return <svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="88" rx="32" ry="4" fill="#1c3b29" opacity=".12" />{arts[kind]}</svg>;
}
