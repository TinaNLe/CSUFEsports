import { notFound } from "next/navigation";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import styles from "../news.module.css";
import { getAllNews, getNewsSource } from "@/lib/news";

export function generateStaticParams() {
  return getAllNews().map((article) => ({ slug: article.slug }));
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let source: string;
  try {
    source = getNewsSource(slug);
  } catch {
    notFound();
  }

  const { data, content } = matter(source);

  return (
    <div style={{ paddingTop: "80px" }}>
      <article className={styles.article}>
        <span className={styles.date}>{data.date}</span>
        <h1 className={styles.heading} style={{ fontSize: "44px" }}>
          {data.title}
        </h1>
        {data.author && <p className={styles.author}>By {data.author}</p>}
        <div className={styles.prose}>
          <MDXRemote source={content} />
        </div>
      </article>
    </div>
  );
}
