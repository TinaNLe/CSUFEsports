import { Client, isFullPage } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const DATABASE_ID = process.env.NOTION_EVENTS_DATABASE_ID ?? "";

const isConfigured = Boolean(process.env.NOTION_API_KEY && DATABASE_ID);

if (!isConfigured) {
  console.warn(
    "[events] NOTION_API_KEY / NOTION_EVENTS_DATABASE_ID are not set — the Events list will be empty until configured (see .env.local.example)."
  );
}

export type EventItem = {
  id: string;
  game: string;
  title: string;
  date: string;
  location: string;
  format: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function textFrom(prop: any): string {
  if (!prop) return "";
  if (prop.type === "title") return prop.title.map((t: { plain_text: string }) => t.plain_text).join("");
  if (prop.type === "rich_text") return prop.rich_text.map((t: { plain_text: string }) => t.plain_text).join("");
  if (prop.type === "select") return prop.select?.name ?? "";
  if (prop.type === "date") return prop.date?.start ?? "";
  return "";
}

export async function getAllEvents(): Promise<EventItem[]> {
  if (!isConfigured) return [];

  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    sorts: [{ property: "Event date", direction: "ascending" }],
  });

  return response.results.filter(isFullPage).map((page) => {
    const props = page.properties;
    const date = textFrom(props["Event date"]);
    return {
      id: page.id,
      game: textFrom(props.Category),
      title: textFrom(props["Event name"]),
      date: date || "TBD",
      location: textFrom(props.Location),
      format: textFrom(props.Format),
    };
  });
}
