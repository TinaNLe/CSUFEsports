"use client";

import { useRef } from "react";
import styles from "../page.module.css";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = () => {
    window.dispatchEvent(new Event("hero-video-ended"));
    videoRef.current?.play();
  };

  return (
    <section id="media" className={styles.hero}>
      <video
        ref={videoRef}
        className={styles.heroVideo}
        src="/videos/hero.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnded}
      />
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
    </section>
  );
}
