import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import styles from "../news.module.css";
import { getAllNews, getArticleCoverImage, getNewsBySlug, getNewsMarkdown } from "@/lib/news";

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getAllNews();
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await getNewsBySlug(slug);
  if (!article) {
    notFound();
  }

  // These don't depend on each other — only on the pageId already resolved
  // above — so run them concurrently instead of one after the other.
  const [content, image] = await Promise.all([
    getNewsMarkdown(article.pageId),
    getArticleCoverImage(article.pageId),
  ]);

  return (
    <div style={{ paddingTop: "80px" }}>
      {image && (
        <div className={styles.hero}>
          <img src={image} alt="" />
        </div>
      )}
      <article className={styles.article}>
        <span className={styles.date}>{article.date}</span>
        <h1 className={styles.heading} style={{ fontSize: "44px" }}>
          {article.title}
        </h1>
        <div className={styles.prose}>
          <MDXRemote source={content} />
        </div>
      </article>
    </div>
  );
}
