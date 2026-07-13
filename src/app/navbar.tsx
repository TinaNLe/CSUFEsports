"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Barlow } from "next/font/google";
import styles from "./navbar.module.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-barlow",
});

const links = [
  { href: "/about", label: "ABOUT" },
  { href: "/events", label: "EVENTS" },
  { href: "/teams", label: "TEAMS" },
  { href: "/sponsors", label: "SPONSORS" },
  { href: "/leadership", label: "LEADERSHIP" },
];

export default function NavBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [stayVisible, setStayVisible] = useState(false);

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    const handleVideoEnded = () => setStayVisible(true);
    window.addEventListener("hero-video-ended", handleVideoEnded);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hero-video-ended", handleVideoEnded);
    };
  }, [isHome]);

  const visible = !isHome || scrolled || stayVisible;

  return (
    <nav
      className={`${styles.navContainer} ${barlow.variable} ${
        visible ? styles.visible : ""
      }`}
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