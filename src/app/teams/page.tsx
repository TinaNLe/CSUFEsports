import styles from "../section.module.css";
import Marquee from "../components/Marquee";

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

      <Marquee text="CSUF Gaming & Esports" speed={30} />
      
    </div>
  );
}
