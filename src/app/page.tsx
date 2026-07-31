import Link from "next/link";
import styles from "./page.module.css";
import HeroVideo from "./components/HeroVideo";
import ScrollReveal from "./components/ScrollReveal";
import { getAllNews } from "@/lib/news";
import { getAllEvents } from "@/lib/events";
import { formatDate } from "@/lib/date";

export const revalidate = 60;

export default async function Home() {
  const [news, events] = await Promise.all([
    getAllNews().then((articles) => articles.slice(0, 3)),
    getAllEvents().then((items) => items.slice(0, 3)),
  ]);

  return (
    <>
    { /* Change this when video is ready
      <HeroVideo />
    */ }
      <HeroVideo />
      <ScrollReveal>
        <section id="events" className={styles.events}>
          <h1 className={styles.eventsHeading}>
            <Link href="/events">UPCOMING EVENTS</Link>
          </h1>
          <div className={styles.eventsList}>
            {events.length === 0 && (
              <p className={styles.empty}>No events scheduled yet. Check back soon.</p>
            )}
            {events.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <div
                  className={styles.eventMedia}
                  style={!event.image ? { backgroundColor: "#ffffff" } : undefined}
                >
                  {event.image && <img src={event.image} alt={event.title} />}
                  {event.game && <span className={styles.mediaLabel}>{event.game}</span>}
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
      </ScrollReveal>

      <ScrollReveal>
        <section id="news" className={styles.events}>
          <h1 className={styles.eventsHeading}>
            <Link href="/news">LATEST NEWS</Link>
          </h1>
          <div className={styles.eventsList}>
            {news.length === 0 && (
              <p className={styles.empty}>No articles yet. Check back soon.</p>
            )}
            {news.map((article) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className={styles.eventCard}
              >
                <div
                  className={styles.eventMedia}
                  style={!article.image ? { backgroundColor: "#ffffff" } : undefined}
                >
                  {article.image && (
                    <img src={article.image} alt={article.title} loading="lazy" />
                  )}
                  <span className={styles.mediaLabel}>{formatDate(article.date)}</span>
                </div>
                <div className={styles.eventBody}>
                  {article.genre && <div className={styles.eventGame}>{article.genre}</div>}
                  <div className={styles.eventTitle}>{article.title}</div>
                  <div className={styles.eventDate}>{article.excerpt}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </ScrollReveal>

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
