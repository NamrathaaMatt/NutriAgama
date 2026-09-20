'use client';
import './contactForm.css';
import { useState } from 'react';

const initialState = {
  name: '',
  email: '',
  subject: '',
  orderId: '',
  message: '',
};

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function fireRipple(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'c-ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    fireRipple(e.nativeEvent);
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Request failed');

      setStatus('success');
      setForm(initialState);
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="formRow">
        <div className="inputGroup">
          <label className="inputLabel" htmlFor="name">Your name</label>
          <div className="inputUnderline">
            <input id="name" name="name" type="text" className="input" placeholder="Your full name" value={form.name} onChange={handleChange} required />
          </div>
        </div>

        <div className="inputGroup">
          <label className="inputLabel" htmlFor="email">Email address</label>
          <div className="inputUnderline">
            <input id="email" name="email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
        </div>
      </div>

      <div className="formRow">
        <div className="inputGroup">
          <label className="inputLabel" htmlFor="subject">Subject</label>
          <div className="inputUnderline">
            <input id="subject" name="subject" type="text" className="input" placeholder="What's this about?" value={form.subject} onChange={handleChange} required />
          </div>
        </div>

        <div className="inputGroup">
          <label className="inputLabel" htmlFor="orderId">Order ID (optional)</label>
          <div className="inputUnderline">
            <input id="orderId" name="orderId" type="text" className="input" placeholder="e.g. #ORD-20480" value={form.orderId} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="inputGroup">
        <label className="inputLabel" htmlFor="message">Message</label>
        <div className="inputUnderline">
          <textarea id="message" name="message" className="textarea" placeholder="Describe your issue in detail..." value={form.message} onChange={handleChange} required />
        </div>
      </div>

      <div className="submitRow">
        <button type="submit" className="submitBtn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Send message'}
        </button>

        {status === 'success' && (
          <span className="statusMsgSuccess show">
            <svg viewBox="0 0 20 20" fill="none" className="checkIcon">
              <path d="M4 10 L8 14 L16 5" stroke="#4b5a3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Message sent! We'll get back to you shortly.
          </span>
        )}
        {status === 'error' && (
          <span className="statusMsgError show">Something went wrong. Please try again.</span>
        )}
      </div>
    </form>
  );
}
