"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./news.module.css";
import { formatDate } from "@/lib/date";
import type { NewsMeta } from "@/lib/news";

export default function NewsList({ articles }: { articles: NewsMeta[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q)
    );
  }, [articles, query]);

  return (
    <>
      <div className={styles.searchWrap}>
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search news…"
          aria-label="Search news"
          className={styles.searchInput}
        />
      </div>

      <div className={styles.list}>
        {articles.length === 0 && (
          <p className={styles.empty}>No articles yet. Check back soon.</p>
        )}

        {articles.length > 0 && filtered.length === 0 && (
          <p className={styles.empty}>No articles match &ldquo;{query}&rdquo;.</p>
        )}

        {filtered.map((article) => (
          <Link key={article.slug} href={`/news/${article.slug}`} className={styles.card}>
            <div
              className={styles.cardMedia}
              style={!article.image ? { backgroundColor: "#ffffff" } : undefined}
            >
              {article.image && (
                <img src={article.image} alt={article.title} loading="lazy" />
              )}
              <span className={styles.mediaDate}>{formatDate(article.date)}</span>
            </div>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{article.title}</h2>
              <p className={styles.excerpt}>{article.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
