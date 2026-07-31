import { Client, isFullPage } from "@notionhq/client";
import { unstable_cache } from "next/cache";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const DATABASE_ID = process.env.NOTION_ESPORTS_ACHIEVEMENTS_ID ?? "";

const isConfigured = Boolean(process.env.NOTION_API_KEY && DATABASE_ID);

if (!isConfigured) {
  console.warn(
    "[achievements] NOTION_API_KEY / NOTION_ESPORTS_ACHIEVEMENTS_ID are not set — team achievements will be empty until configured (see .env.local.example)."
  );
}

export type TextSegment = {
  text: string;
  href: string | null;
};

export type Achievement = {
  id: string;
  date: string;
  segments: TextSegment[];
  image: string | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function textFrom(prop: any): string {
  if (!prop) return "";
  if (prop.type === "title") return prop.title.map((t: { plain_text: string }) => t.plain_text).join("");
  if (prop.type === "rich_text") return prop.rich_text.map((t: { plain_text: string }) => t.plain_text).join("");
  if (prop.type === "date") return prop.date?.start ?? "";
  return "";
}

// Notion lets you hyperlink part of a rich-text field (e.g. just the word
// "LBCC" inside "Won LBCC") — preserving that per-segment href, rather than
// collapsing to plain text, is what lets that link carry through to the site.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function segmentsFrom(prop: any): TextSegment[] {
  if (!prop || prop.type !== "rich_text") return [];
  return prop.rich_text.map((t: { plain_text: string; href: string | null }) => ({
    text: t.plain_text,
    href: t.href,
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function imageFrom(prop: any): string | null {
  const file = prop?.files?.[0];
  if (!file) return null;
  return file.type === "external" ? file.external.url : file.file.url;
}

// Each row is one achievement, grouped by the team's "Name" property — a team
// can have any number of rows (or none, if it hasn't earned an achievement yet).
export const getAchievementsByTeam = unstable_cache(
  async (): Promise<Record<string, Achievement[]>> => {
    if (!isConfigured) return {};

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [{ property: "date", direction: "descending" }],
    });

    const byTeam: Record<string, Achievement[]> = {};

    for (const page of response.results.filter(isFullPage)) {
      const props = page.properties;
      // Trimmed because Notion rows have included trailing-space variants of
      // the same team name (e.g. "Counter-Strike" vs "Counter-Strike ") that
      // would otherwise be grouped as two different teams.
      const team = textFrom(props.Name).trim();
      if (!team) continue;

      const achievement: Achievement = {
        id: page.id,
        date: textFrom(props.date),
        segments: segmentsFrom(props.Description),
        image: imageFrom(props["Files & media"]),
      };

      (byTeam[team] ??= []).push(achievement);
    }

    return byTeam;
  },
  ["esports-achievements"],
  { revalidate: 60 }
);
