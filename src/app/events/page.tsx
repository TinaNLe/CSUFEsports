import styles from "../page.module.css";

const events = [
  { game: "Valorant", title: "Scrimmage", date: "TBD" },
  { game: "League of Legends", title: "CLOL Invitational", date: "TBD" },
  { game: "CS2", title: "CCC", date: "TBD" },
];

export default function EventsPage() {
  return (
    <section className={styles.events}>
      <h1 className={styles.eventsHeading}>Upcoming Events</h1>
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
  );
}
