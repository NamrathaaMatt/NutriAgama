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
            <a href="#" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            <a href="#" aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            <a href="#" aria-label="Whatsapp">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
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