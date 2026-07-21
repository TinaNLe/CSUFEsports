"use client";

import Link from "next/link";
import Image from "next/image";
import { Barlow } from "next/font/google";
import styles from "./navbar.module.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-barlow",
});

const links = [
  { href: "/news", label: "NEWS" },
  { href: "/events", label: "EVENTS" },
  { href: "/teams", label: "TEAMS" },
  { href: "/sponsors", label: "SPONSORS" },
];

const aboutDropdown = {
  label: "ABOUT",
  items: [
    { href: "/about", label: "ABOUT" },
    { href: "/leadership", label: "LEADERSHIP" },
  ],
};

export default function NavBar() {
  return (
    <nav
      className={`${styles.navContainer} ${barlow.variable} ${styles.visible}`}
    >
      <Link href="/" className={styles.logo}>
        <Image
          src="/images/logo/CSUF_GAMINGESPORTS_2025LOGO_WHOLE.png"
          alt="CSUF Esports logo"
          width={280}
          height={60}
          className={styles.logoImage}
        />
      </Link>
      <ul className={styles.linkList}>
        <li className={styles.dropdown}>
          <span className={styles.navLink}>{aboutDropdown.label}</span>
          <ul className={styles.dropdownMenu}>
            {aboutDropdown.items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.dropdownLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}