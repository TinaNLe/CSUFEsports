import Link from "next/link";
import styles from "./page.module.css";
import HeroVideo from "./components/HeroVideo";
import { getAllNews } from "@/lib/news";
import { getAllEvents } from "@/lib/events";

export const revalidate = 60;

export default async function Home() {
  const [news, events] = await Promise.all([
    getAllNews().then((articles) => articles.slice(0, 3)),
    getAllEvents().then((items) => items.slice(0, 3)),
  ]);

  return (
    <>
      <HeroVideo />

      <section id="events" className={styles.events}>
        <h1 className={styles.eventsHeading}>
          <Link href="/events">Upcoming Events</Link>
        </h1>
        <div className={styles.eventsList}>
          {events.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              {event.image && (
                <div className={styles.eventMedia}>
                  <img src={event.image} alt="" loading="lazy" />
                  {event.game && <span className={styles.mediaLabel}>{event.game}</span>}
                </div>
              )}
              <div className={styles.eventBody}>
                {!event.image && event.game && (
                  <div className={styles.eventGame}>{event.game}</div>
                )}
                <div className={styles.eventTitle}>{event.title}</div>
                <div className={styles.eventDate}>{event.date}</div>
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

      {news.length > 0 && (
        <section id="news" className={styles.events}>
          <h1 className={styles.eventsHeading}>
            <Link href="/news">Latest News</Link>
          </h1>
          <div className={styles.eventsList}>
            {news.map((article) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className={styles.eventCard}
              >
                {article.image && (
                  <div className={styles.eventMedia}>
                    <img src={article.image} alt="" loading="lazy" />
                    <span className={styles.mediaLabel}>{article.date}</span>
                  </div>
                )}
                <div className={styles.eventBody}>
                  {!article.image && <div className={styles.eventGame}>{article.date}</div>}
                  <div className={styles.eventTitle}>{article.title}</div>
                  <div className={styles.eventDate}>{article.excerpt}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

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
