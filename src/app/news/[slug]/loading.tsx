import styles from "../news.module.css";

export default function NewsArticleLoading() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <div className={`${styles.hero} skeleton`} />
      <article className={styles.article}>
        <span className={`${styles.date} skeleton`} style={{ borderRadius: 4 }}>
          &nbsp;
        </span>
        <div
          className="skeleton"
          style={{
            height: 44,
            width: "70%",
            borderRadius: 6,
            margin: "8px 0 28px",
          }}
        />
        {[100, 100, 80, 100, 60].map((w, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              height: 18,
              width: `${w}%`,
              borderRadius: 4,
              marginBottom: 14,
            }}
          />
        ))}
      </article>
    </div>
  );
}
