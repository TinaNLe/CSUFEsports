import Link from "next/link";
import styles from "./news.module.css";
import { getAllNews } from "@/lib/news";

export default function NewsPage() {
  const articles = getAllNews();

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
              <span className={styles.date}>{article.date}</span>
              <h2 className={styles.cardTitle}>{article.title}</h2>
              <p className={styles.excerpt}>{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
