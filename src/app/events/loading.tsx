import styles from "../page.module.css";

export default function EventsLoading() {
  return (
    <section className={styles.events}>
      <h1 className={styles.eventsHeading}>Upcoming Events</h1>
      <div className={`${styles.eventsList} ${styles.eventsListLeft}`}>
        {Array.from({ length: 6 }).map((_, i) => (
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
              <div
                className="skeleton"
                style={{ height: 14, width: "40%", borderRadius: 4 }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
