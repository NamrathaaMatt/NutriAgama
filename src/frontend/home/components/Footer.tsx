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
              Instagram
            </a>

            <a href="#" aria-label="Facebook">
              Facebook
            </a>

            <a href="#" aria-label="Twitter">
              Twitter
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