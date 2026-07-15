import { Client, isFullBlock } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

// The News tab is a plain Notion page — every child page under it is one article.
const ROOT_PAGE_ID = process.env.NOTION_NEWS_PAGE_ID ?? "";

const isConfigured = Boolean(process.env.NOTION_API_KEY && ROOT_PAGE_ID);

if (!isConfigured) {
  console.warn(
    "[news] NOTION_API_KEY / NOTION_NEWS_PAGE_ID are not set — the News tab will show no articles until configured (see .env.local.example)."
  );
}

export type NewsMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  pageId: string;
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function excerptFrom(markdown: string): string {
  const line = markdown
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith("#"));
  if (!line) return "";
  return line.length > 160 ? `${line.slice(0, 160)}…` : line;
}

async function listArticlePages() {
  const response = await notion.blocks.children.list({ block_id: ROOT_PAGE_ID });
  return response.results
    .filter(isFullBlock)
    .filter((block) => block.type === "child_page")
    .map((block) => ({
      pageId: block.id,
      title: block.child_page.title,
      date: block.created_time.slice(0, 10),
    }));
}

export async function getAllNews(): Promise<NewsMeta[]> {
  if (!isConfigured) return [];

  const pages = await listArticlePages();
  pages.sort((a, b) => (a.date < b.date ? 1 : -1));

  const articles = await Promise.all(
    pages.map(async (page) => {
      const markdown = await getNewsMarkdown(page.pageId);
      return {
        slug: slugify(page.title),
        title: page.title,
        date: page.date,
        excerpt: excerptFrom(markdown),
        pageId: page.pageId,
      };
    })
  );

  return articles;
}

export async function getNewsBySlug(slug: string): Promise<NewsMeta | null> {
  if (!isConfigured) return null;

  const pages = await listArticlePages();
  const page = pages.find((p) => slugify(p.title) === slug);
  if (!page) return null;

  const markdown = await getNewsMarkdown(page.pageId);
  return {
    slug,
    title: page.title,
    date: page.date,
    excerpt: excerptFrom(markdown),
    pageId: page.pageId,
  };
}

export async function getNewsMarkdown(pageId: string): Promise<string> {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const { parent } = n2m.toMarkdownString(mdBlocks);
  return parent ?? "";
}
