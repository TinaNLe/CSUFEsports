import { Client, isFullBlock } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

// Notion collapses empty paragraph blocks to nothing once run through markdown,
// so a manually-added blank line in Notion loses its visual gap. Rendering it as
// an explicit <br /> keeps the article a 1:1 copy of the Notion spacing.
n2m.setCustomTransformer("paragraph", async (block) => {
  if (!isFullBlock(block) || block.type !== "paragraph") return false;
  const isEmpty = block.paragraph.rich_text.every((t) => !t.plain_text.trim());
  return isEmpty ? "<br />" : false;
});

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

const HEADING_TYPES = new Set(["heading_1", "heading_2", "heading_3"]);

function truncate(text: string): string {
  return text.length > 160 ? `${text.slice(0, 160)}…` : text;
}

// Building the excerpt from a full notion-to-md conversion (resolving every
// block, image, and nested child recursively) is why the news list used to be
// slow — all it actually needs is the first line of text. Reading just the
// page's top-level blocks directly is far cheaper.
async function excerptForPage(pageId: string): Promise<string> {
  const response = await notion.blocks.children.list({ block_id: pageId, page_size: 10 });

  for (const block of response.results) {
    if (!isFullBlock(block) || HEADING_TYPES.has(block.type)) continue;

    const richText = (block as unknown as Record<string, { rich_text?: { plain_text: string }[] }>)[
      block.type
    ]?.rich_text;
    const text = (richText ?? []).map((t) => t.plain_text).join("").trim();
    if (text) return truncate(text);
  }

  return "";
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
    pages.map(async (page) => ({
      slug: slugify(page.title),
      title: page.title,
      date: page.date,
      excerpt: await excerptForPage(page.pageId),
      pageId: page.pageId,
    }))
  );

  return articles;
}

export async function getNewsBySlug(slug: string): Promise<NewsMeta | null> {
  if (!isConfigured) return null;

  const pages = await listArticlePages();
  const page = pages.find((p) => slugify(p.title) === slug);
  if (!page) return null;

  return {
    slug,
    title: page.title,
    date: page.date,
    excerpt: await excerptForPage(page.pageId),
    pageId: page.pageId,
  };
}

export async function getNewsMarkdown(pageId: string): Promise<string> {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const { parent } = n2m.toMarkdownString(mdBlocks);
  return parent ?? "";
}
