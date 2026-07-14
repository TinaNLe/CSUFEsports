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
    </section>
  );
}
