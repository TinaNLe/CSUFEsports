import styles from "./news.module.css";
import { getAllNews } from "@/lib/news";
import NewsSearch from "./NewsSearch";

export const revalidate = 60;

export default async function NewsPage() {
  const articles = await getAllNews();

  return (
    <div style={{ paddingTop: "80px" }}>
      <section className={styles.section}>
        <h1 className={styles.heading}>NEWS</h1>
        <NewsSearch articles={articles} />
      </section>
    </div>
  );
}
