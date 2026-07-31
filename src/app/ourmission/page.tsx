import styles from "../section.module.css";

export default function AboutPage() {
  return (
    <section className={styles.section}>
      <h1 className={styles.heading}>Our Mission</h1>
      <p className={styles.paragraph}>
        CSUF Gaming & Esports is dedicated to fostering a vibrant gaming and esports community at California State University, Fullerton. Our mission is to provide students with opportunities to engage in competitive gaming, develop leadership skills, and build lasting connections through shared passion for esports.
      </p>
      <p className={styles.paragraph}>
        We strive to create an inclusive environment where students of all backgrounds can come together to learn, compete, and grow. By promoting teamwork, sportsmanship, and personal development, we aim to empower our members to achieve their full potential both in gaming and in life.
      </p>
    </section>
  );
}
