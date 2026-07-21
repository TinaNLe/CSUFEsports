import { Client, isFullBlock, isFullPage } from "@notionhq/client";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
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

// Notion has no real "center this image" toggle — centering is done by putting
// the image in a column flanked by empty columns. That layout has no markdown
// equivalent and gets flattened away by default, losing both the centering and
// the narrower width. When a column_list is exactly "empty, one image, empty"
// (or any single image column among empty ones), reproduce it directly as a
// centered image sized to that column's actual width.
n2m.setCustomTransformer("column_list", async (block) => {
  if (!isFullBlock(block) || block.type !== "column_list") return false;

  const columnsResponse = await notion.blocks.children.list({ block_id: block.id });
  const columns = columnsResponse.results.filter(isFullBlock).filter((c) => c.type === "column");

  let imageWidthPercent: number | null = null;
  let imageBlock: BlockObjectResponse | null = null;
  let onlyOneImageColumn = true;

  // Columns are independent Notion API calls — fetch them concurrently rather
  // than one at a time, since nothing here depends on another column's result.
  const columnChildren = await Promise.all(
    columns.map((column) =>
      column.type === "column"
        ? notion.blocks.children.list({ block_id: column.id })
        : null
    )
  );

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    const childrenResponse = columnChildren[i];
    if (column.type !== "column" || !childrenResponse) continue;
    const nonEmpty = childrenResponse.results.filter(isFullBlock).filter((c) => {
      if (c.type === "paragraph") return c.paragraph.rich_text.some((t) => t.plain_text.trim());
      return true;
    });

    if (nonEmpty.length === 0) continue;
    if (nonEmpty.length === 1 && nonEmpty[0].type === "image") {
      if (imageWidthPercent !== null) {
        onlyOneImageColumn = false;
      }
      imageWidthPercent = Math.round((column.column.width_ratio ?? 1) * 100);
      imageBlock = nonEmpty[0];
    } else {
      onlyOneImageColumn = false;
    }
  }

  if (!onlyOneImageColumn || imageWidthPercent === null || !imageBlock || imageBlock.type !== "image") {
    return false;
  }

  const imageData = imageBlock.image;
  const url = imageData.type === "external" ? imageData.external.url : imageData.file.url;
  const alt = imageData.caption.map((t) => t.plain_text).join("") || "image";

  // next-mdx-remote strips object-valued `style` props on raw elements, so the
  // width has to travel as a plain HTML attribute instead; centering comes
  // from the `.prose img` rule (display: block; margin: auto) in news.module.css.
  return `<img src=${JSON.stringify(url)} alt=${JSON.stringify(alt)} width="${imageWidthPercent}%" />`;
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
  image: string | null;
};

// What the article detail page actually needs to locate and render a page —
// no excerpt, since only the list views show one.
export type NewsArticleRef = {
  slug: string;
  title: string;
  date: string;
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

// The card image is whatever cover the user set on the article page in
// Notion — nothing to configure, no separate "image" property to maintain.
export async function getArticleCoverImage(pageId: string): Promise<string | null> {
  const page = await notion.pages.retrieve({ page_id: pageId });
  if (!isFullPage(page) || !page.cover) return null;
  return page.cover.type === "external" ? page.cover.external.url : page.cover.file.url;
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
      const [excerpt, image] = await Promise.all([
        excerptForPage(page.pageId),
        getArticleCoverImage(page.pageId),
      ]);
      return {
        slug: slugify(page.title),
        title: page.title,
        date: page.date,
        excerpt,
        image,
        pageId: page.pageId,
      };
    })
  );

  return articles;
}

// The detail page only needs enough to locate the page and render its
// header — fetching an excerpt or cover image here would be wasted work
// (the excerpt is never shown, and the cover is fetched in parallel with the
// markdown conversion by the caller instead of blocking on it first).
export async function getNewsBySlug(slug: string): Promise<NewsArticleRef | null> {
  if (!isConfigured) return null;

  const pages = await listArticlePages();
  const page = pages.find((p) => slugify(p.title) === slug);
  if (!page) return null;

  return {
    slug,
    title: page.title,
    date: page.date,
    pageId: page.pageId,
  };
}

export async function getNewsMarkdown(pageId: string): Promise<string> {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const { parent } = n2m.toMarkdownString(mdBlocks);
  return parent ?? "";
}
