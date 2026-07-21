import Link from "next/link";
import styles from "./news.module.css";
import { getAllNews } from "@/lib/news";

export const revalidate = 60;

export default async function NewsPage() {
  const articles = await getAllNews();

  return (
    <div style={{ paddingTop: "80px" }}>
      <section className={styles.section}>
        <h1 className={styles.heading}>News</h1>

        <div className={styles.list}>
          {articles.length === 0 && (
            <p className={styles.empty}>No articles yet. Check back soon.</p>
          )}

          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/news/${article.slug}`}
              className={styles.card}
            >
              {article.image && (
                <div className={styles.cardMedia}>
                  <img src={article.image} alt="" loading="lazy" />
                  <span className={styles.mediaDate}>{article.date}</span>
                </div>
              )}
              <div className={styles.cardBody}>
                {!article.image && <span className={styles.date}>{article.date}</span>}
                <h2 className={styles.cardTitle}>{article.title}</h2>
                <p className={styles.excerpt}>{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
