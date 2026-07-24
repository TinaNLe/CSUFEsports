import styles from "./page.module.css";
import { getAllEvents } from "@/lib/events";
import { formatDate } from "@/lib/date";

export const revalidate = 60;

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <section className={styles.events}>
      <h1 className={styles.eventsHeading}>Upcoming Events</h1>
      <div className={`${styles.eventsList} ${styles.eventsListLeft}`}>
        {events.length === 0 && <p>No events scheduled yet. Check back soon.</p>}
        {events.map((event) => (
          <div key={event.id} className={styles.eventCard}>
            <div
              className={styles.eventMedia}
              style={!event.image ? { backgroundColor: "#ffffff" } : undefined}
            >
              {event.image && <img src={event.image} alt={event.title} loading="lazy" />}
              {event.game && <span className={styles.mediaGame}>{event.game}</span>}
            </div>
            <div className={styles.eventBody}>
              <div className={styles.eventTitle}>{event.title}</div>
              <div className={styles.eventDate}>{formatDate(event.date)}</div>
              {(event.location || event.format) && (
                <div className={styles.eventLocation}>
                  {[event.location, event.format].filter(Boolean).join(" · ")}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
