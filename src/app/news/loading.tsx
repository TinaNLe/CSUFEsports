import styles from "./news.module.css";

export default function NewsLoading() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <section className={styles.section}>
        <h1 className={styles.heading}>News</h1>

        <div className={styles.list}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.card} style={{ pointerEvents: "none" }}>
              <div className={`${styles.cardMedia} skeleton`} />
              <div className={styles.cardBody}>
                <div
                  className="skeleton"
                  style={{ height: 22, width: "80%", borderRadius: 4 }}
                />
                {[100, 70].map((w, j) => (
                  <div
                    key={j}
                    className="skeleton"
                    style={{ height: 16, width: `${w}%`, borderRadius: 4 }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
