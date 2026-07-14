import fs from "fs";
import path from "path";
import matter from "gray-matter";

const NEWS_DIR = path.join(process.cwd(), "src/content/news");

export type NewsMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author?: string;
};

export function getAllNews(): NewsMeta[] {
  const files = fs.readdirSync(NEWS_DIR).filter((f) => f.endsWith(".mdx"));

  const articles = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(NEWS_DIR, filename), "utf8");
    const { data } = matter(raw);

    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      excerpt: (data.excerpt as string) ?? "",
      author: data.author as string | undefined,
    };
  });

  return articles.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNewsSource(slug: string): string {
  const filePath = path.join(NEWS_DIR, `${slug}.mdx`);
  return fs.readFileSync(filePath, "utf8");
}
