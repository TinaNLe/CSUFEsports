"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";

const MAX_OPACITY = 0.8;
const FADE_DISTANCE = 200;

export default function HeroVideo() {
  const [visible, setVisible] = useState(false);
  const [scrollRatio, setScrollRatio] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);

    const handleScroll = () => {
      const ratio = 1 - window.scrollY / FADE_DISTANCE;
      setScrollRatio(Math.max(0, Math.min(1, ratio)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const opacity = visible ? MAX_OPACITY * scrollRatio : 0;

  return (
    <section id="media" className={styles.hero}>
      <div className={styles.scrollArrowWrap} style={{ opacity }}>
        <svg
          className={styles.scrollArrow}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
