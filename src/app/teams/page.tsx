import styles from "../section.module.css";

export default function TeamsPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <section className={styles.section}>
        <h1 className={styles.heading}>Teams</h1>
        <p className={styles.text}>
          Meet the rosters representing CSUF across our competitive titles.
          Team pages are coming soon.
        </p>
      </section>
    </div>
  );
}
