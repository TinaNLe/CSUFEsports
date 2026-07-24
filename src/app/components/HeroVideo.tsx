import styles from "../page.module.css";

export default function HeroVideo() {
  return (
    <section id="media" className={styles.hero}>
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
