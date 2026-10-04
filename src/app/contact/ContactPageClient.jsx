'use client';

import { useEffect } from 'react';
import ContactForm from './contactForm';
import './contactForm.css';

const EMAIL = 'aruyaagamasirinutri55@gmail.com';

/* SVG icons (replace the old emojis) */
const ICON_PATHS = {
  chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
};

function Icon({ name }) {
  return (
    <svg
      className="c-svg-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

const quickActions = [
  { icon: 'chat', label: 'Live chat', sub: 'Fastest response', href: '#' },
  { icon: 'phone', label: 'Call us', sub: '+91 80731 40054', href: 'tel:+918073140054' },
  { icon: 'mail', label: 'Email', sub: EMAIL, href: `mailto:${EMAIL}` },
  { icon: 'whatsapp', label: 'WhatsApp', sub: '+91 90365 72176', href: 'https://wa.me/919036572176' },
];

const offices = [
  {
    icon: 'pin',
    title: 'Our Location',
    lines: ['Siri Nutrimill', 'Gullahatti Kaval, Thataguppe Post', 'Harohalli Taluk, Bengaluru South District', 'Ramanagara – 562112'],
  },
  {
    icon: 'clock',
    title: 'Support Hours',
    lines: ['Mon – Sat: 8:00 AM – 10:00 PM', 'Sunday: 9:00 AM – 8:00 PM'],
  },
  {
    icon: 'phone',
    title: 'Call Us',
    lines: ['+91 80731 40054', '+91 90365 72176'],
  },
  {
    icon: 'mail',
    title: 'Email Us',
    lines: [EMAIL],
  },
];

export default function ContactPageClient() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.c-reveal, .c-reveal-left, .c-reveal-right').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <main className="contact-page">
      <div className="c-grain" aria-hidden="true" />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="c-hero">
        <div className="c-container">
          <span className="c-eyebrow c-reveal">We'd love to hear from you</span>
          <h1 className="c-heading c-reveal" style={{ transitionDelay: '0.1s' }}>Get in touch with Nutri Agama</h1>
          <p className="c-sub c-reveal" style={{ transitionDelay: '0.2s' }}>
            Questions about your order or a meal plan? Our team replies fast — usually within a few minutes during support hours.
          </p>
        </div>
      </section>

      <div className="c-container">
        {/* ── QUICK ACTIONS ──────────────────────────────── */}
        <section className="c-quick-grid">
          {quickActions.map((action, i) => (
            <a
              key={action.label}
              href={action.href}
              target={action.href.startsWith('http') ? '_blank' : undefined}
              rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="c-quick-card c-reveal"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="c-quick-card__icon"><Icon name={action.icon} /></div>
              <div className="c-quick-card__label">{action.label}</div>
              <div className="c-quick-card__sub">{action.sub}</div>
            </a>
          ))}
        </section>

        {/* ── FORM + OFFICES ─────────────────────────────── */}
        <section className="c-grid">
          <div className="c-form-panel c-reveal-left">
            <h2>Send us a message</h2>
            <ContactForm />
          </div>

          <div className="c-offices">
            {offices.map((office, i) => (
              <div key={office.title} className="c-office-card c-reveal-right" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="c-office-card__title"><span className="c-office-card__icon"><Icon name={office.icon} /></span> {office.title}</div>
                {office.lines.map((line) => (
                  <div key={line} className="c-office-card__line">
                    {line === EMAIL ? (
                      <a href={`mailto:${EMAIL}`} className="c-office-card__link">{line}</a>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}