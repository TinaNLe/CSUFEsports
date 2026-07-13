"use client";

import { useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const events = [
  { game: "Valorant", title: "CSUF vs. UCLA Scrimmage", date: "TBD" },
  { game: "League of Legends", title: "Fall Invitational", date: "TBD" },
  { game: "Super Smash Bros.", title: "Titan Smash Weekly", date: "TBD" },
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = () => {
    window.dispatchEvent(new Event("hero-video-ended"));
    videoRef.current?.play();
  };

  return (
    <>
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

      <section id="events" className={styles.events}>
        <h1 className={styles.eventsHeading}>
          <Link href="/events">Upcoming Events</Link>
        </h1>
        <div className={styles.eventsList}>
          {events.map((event) => (
            <div key={event.title} className={styles.eventCard}>
              <div className={styles.eventGame}>{event.game}</div>
              <div className={styles.eventTitle}>{event.title}</div>
              <div className={styles.eventDate}>{event.date}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="teams">
        
      </section>

      <section id="leadership">
        
      </section>
      <section id="about" className={styles.about}>
        <h1 className={styles.aboutHeading}>About</h1>
        <p className={styles.aboutText}>
          CSUF Gaming & Esports is Cal State Fullerton&apos;s home for
          competitive gaming, bringing together students to compete, connect,
          and grow across a wide range of titles and events.
        </p>
      </section>
    </>
  );
}
