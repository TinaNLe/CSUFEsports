import styles from "./page.module.css";

function CardSkeleton({ i }: { i: number }) {
  return (
    <div key={i} className={styles.eventCard} style={{ pointerEvents: "none" }}>
      <div className={`${styles.eventMedia} skeleton`} />
      <div className={styles.eventBody}>
        <div
          className="skeleton"
          style={{ height: 22, width: "80%", borderRadius: 4 }}
        />
        <div
          className="skeleton"
          style={{ height: 16, width: "50%", borderRadius: 4 }}
        />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <div className={`${styles.hero} skeleton`} />

      <section className={styles.events}>
        <h1 className={styles.eventsHeading}>Upcoming Events</h1>
        <div className={styles.eventsList}>
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} i={i} />
          ))}
        </div>
      </section>

      <section className={styles.events}>
        <h1 className={styles.eventsHeading}>Latest News</h1>
        <div className={styles.eventsList}>
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} i={i} />
          ))}
        </div>
      </section>
    </>
  );
}
