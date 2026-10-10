"use client";

import Image from "next/image";
import styles from "../styles/footer.module.css";

import logo from "../../components/navbar/assets/logo.png";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.background} />

      <div className={styles.inner}>

        {/* =====================================================
            BRAND
        ===================================================== */}
        <div className={styles.brandColumn}>
          <Image
            src={logo}
            alt="NutriAgama"
            className={styles.logo}
          />

          <p className={styles.tagline}>
            Ancient Nutrition for Modern Life
          </p>

          <div className={styles.socials}>
            <a href="tel:+918073140054" aria-label="Call us">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
              </svg>
            </a>

            <a href="https://wa.me/918073140054" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>

            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=aruyaagamasirinutri55@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email us">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
          </div>
        </div>


        {/* =====================================================
            EXPLORE
        ===================================================== */}
        <div className={styles.column}>
          <span className={styles.heading}>
            EXPLORE
          </span>

          <a href="/shop">Shop</a>
          <a href="/about">About Us</a>
          <a href="/health-benefits">
            Health Benefits
          </a>
          <a href="/contact">
            Contact Us
          </a>
        </div>


        {/* =====================================================
            PRODUCTS
        ===================================================== */}
        <div className={styles.column}>
          <span className={styles.heading}>
            PRODUCTS
          </span>

          <a href="/shop/protein-powder">
            Protein Powder
          </a>

          <a href="/shop/kashaya">
            Kashaya Powder
          </a>

          <a href="/shop/moringa">
            Moringa Leaf Soup
          </a>

          <a href="/shop/menthe-mudde">
            Menthe Mudde
          </a>
        </div>


        {/* =====================================================
            GET IN TOUCH
        ===================================================== */}
        <div className={styles.contactColumn}>
          <span className={styles.heading}>
            GET IN TOUCH
          </span>

          {/* LOCATION */}
          <div className={styles.contactBlock}>
            <span className={styles.contactLabel}>
              OUR LOCATION
            </span>

            <address className={styles.address}>
              Siri Nutrimill
              <br />
              Gullahatti Kaval, Thataguppe Post
              <br />
              Harohalli Taluk, Bengaluru South District
              <br />
              Ramanagara – 562112
            </address>

            <a
              className={styles.mapLink}
              href="https://www.google.com/maps/place/Aruya+Agama+siri+nutrimill/@12.7295509,77.543952,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae43ba94eb7d5d:0xf7393b500a6a53af!8m2!3d12.7295509!4d77.5465269!16s%2Fg%2F11mynmf6f9"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>View on Maps</span>
              <span className={styles.mapArrow}>
                ↗
              </span>
            </a>
          </div>


          {/* SUPPORT HOURS */}
          <div className={styles.contactBlock}>
            <span className={styles.contactLabel}>
              SUPPORT HOURS
            </span>

            <p className={styles.contactText}>
              Mon – Sat: 8:00 AM – 10:00 PM
              <br />
              Sunday: 9:00 AM – 8:00 PM
            </p>
          </div>


          {/* PHONE */}
          <div className={styles.contactBlock}>
            <span className={styles.contactLabel}>
              CALL US
            </span>

            <a
              href="tel:+918073140054"
              className={styles.contactTextLink}
            >
              +91 80731 40054
            </a>

            <a
              href="tel:+919036572176"
              className={styles.contactTextLink}
            >
              +91 90365 72176
            </a>
          </div>


          {/* EMAIL */}
          <div className={styles.contactBlock}>
            <span className={styles.contactLabel}>
              EMAIL US
            </span>

            <a
              href="mailto:aruyaagamasirinutri55@gmail.com"
              className={styles.contactTextLink}
            >
              aruyaagamasirinutri55@gmail.com
            </a>
          </div>
        </div>
      </div>


      {/* =====================================================
          BOTTOM BAR
      ===================================================== */}
      <div className={styles.bottomBar}>
        <span>
          © 2026 NutriAgama. All rights reserved.
        </span>

        <span>
          Made with intention &amp; real ingredients.
        </span>
      </div>
    </footer>
  );
}