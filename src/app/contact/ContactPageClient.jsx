'use client';

import { useEffect } from 'react';
import ContactForm from './contactForm';
import './contactForm.css';

const quickActions = [
  { icon: '💬', label: 'Live chat', sub: 'Fastest response', href: '#' },
  { icon: '📞', label: 'Call us', sub: '+91 80731 40054', href: 'tel:+918073140054' },
  { icon: '📧', label: 'Email', sub: 'aruyaagamasirinutri55@gmail.com', href: 'mailto:aruyaagamasirinutri55@gmail.com' },
  { icon: '💚', label: 'WhatsApp', sub: '+91 90365 72176', href: 'https://wa.me/919036572176' },
];

const offices = [
  {
    icon: '📍',
    title: 'Our Location',
    lines: ['Siri Nutrimill', 'Gullahatti Kaval, Thataguppe Post', 'Harohalli Taluk, Bengaluru South District', 'Ramanagara – 562112'],
  },
  {
    icon: '🕐',
    title: 'Support Hours',
    lines: ['Mon – Sat: 8:00 AM – 10:00 PM', 'Sunday: 9:00 AM – 8:00 PM'],
  },
  {
    icon: '📞',
    title: 'Call Us',
    lines: ['+91 80731 40054', '+91 90365 72176'],
  },
  {
    icon: '📧',
    title: 'Email Us',
    lines: ['aruyaagamasirinutri55@gmail.com'],
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
              <div className="c-quick-card__icon">{action.icon}</div>
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
                <div className="c-office-card__title"><span>{office.icon}</span> {office.title}</div>
                {office.lines.map((line) => (
                  <div key={line} className="c-office-card__line">{line}</div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
