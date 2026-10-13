"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Info, Mail, Store } from "lucide-react";

import cartBlack from "./assets/cartb.png";
import cartWhite from "./assets/cartw.png";
import logo from "./assets/logo.png";
import profileBlack from "./assets/profileb.png";
import profileWhite from "./assets/profilew.png";
import wishlistBlack from "./assets/wishlistb.png";
import wishlistWhite from "./assets/wishlistw.png";
import { primaryNavigation, type NavbarIconTone } from "./navigation";
import styles from "./navbar.module.css";

type NavbarProps = {
  textTone: NavbarIconTone;
  iconTone: NavbarIconTone;
  fixed?: boolean;
  autoContrast?: boolean;
  opaque?: boolean;
};

const actionIcons = {
  black: {
    wishlist: wishlistBlack,
    cart: cartBlack,
    profile: profileBlack,
  },
  white: {
    wishlist: wishlistWhite,
    cart: cartWhite,
    profile: profileWhite,
  },
} as const;

const mobileNavigation = [
  { href: "/", label: "Home", Icon: House },
  { href: "/shop", label: "Shop", Icon: Store },
  { href: "/about", label: "About", Icon: Info },
  { href: "/contact", label: "Contact Us", Icon: Mail },
] as const;

export default function Navbar({
  textTone,
  iconTone,
  fixed = false,
  autoContrast = false,
  opaque = false,
}: NavbarProps) {
  const navbarRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [contrastTone, setContrastTone] = useState<NavbarIconTone>(textTone);

  useEffect(() => {
    if (!fixed || !autoContrast) return;

    const updateContrast = () => {
      const navbarHeight = navbarRef.current?.getBoundingClientRect().height ?? 88;
      const pageElement = document.elementFromPoint(
        window.innerWidth / 2,
        Math.min(window.innerHeight - 1, navbarHeight + 16),
      );
      const tone = pageElement
        ?.closest<HTMLElement>("[data-navbar-tone]")
        ?.dataset.navbarTone;

      setContrastTone(tone === "white" ? "white" : "black");
    };

    updateContrast();
    window.addEventListener("scroll", updateContrast, { passive: true });
    window.addEventListener("resize", updateContrast);

    return () => {
      window.removeEventListener("scroll", updateContrast);
      window.removeEventListener("resize", updateContrast);
    };
  }, [autoContrast, fixed]);

  const resolvedTextTone = autoContrast ? contrastTone : textTone;
  const resolvedIconTone = autoContrast ? contrastTone : iconTone;
  const icons = actionIcons[resolvedIconTone];
  const textToneClass = resolvedTextTone === "white" ? styles.textWhite : "";

  return (
    <header
      ref={navbarRef}
      className={`${styles.navbar} ${textToneClass} ${fixed ? styles.fixed : ""} ${opaque ? styles.opaque : ""}`}
    >
      <Link href="/" className={styles.brand} aria-label="Agama Siri Nutri home">
        <Image
          src={logo}
          alt="Agama Siri Nutri"
          className={styles.logo}
          priority
        />
      </Link>

      <nav className={styles.links} aria-label="Primary navigation">
        {primaryNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${isActive ? styles.linkActive : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <nav className={styles.mobileLinks} aria-label="Mobile primary navigation">
        {mobileNavigation.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={styles.mobileIcon} aria-hidden="true" />
            </Link>
          );
        })}
      </nav>

      <div className={styles.actions}>
        <Link href="/wishlist" className={styles.action} aria-label="Wishlist">
          <Image src={icons.wishlist} alt="" className={styles.icon} />
        </Link>
        <Link href="/cart" className={styles.action} aria-label="Cart">
          <Image src={icons.cart} alt="" className={styles.icon} />
        </Link>
        <Link href="/login" className={styles.action} aria-label="Account">
          <Image src={icons.profile} alt="" className={styles.icon} />
        </Link>
      </div>
    </header>
  );
}
