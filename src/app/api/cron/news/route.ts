import { XMLParser } from "fast-xml-parser";
import { createAdminClient } from "@/lib/supabase/admin";

// Roda diariamente (ver Fase 03 / ITEM-304), agendado em vercel.json.
// Busca o RSS de cada fonte ativa e grava só os itens novos —
// news_items tem um índice único (source_id, link) que descarta
// duplicatas automaticamente.

export const maxDuration = 60;

type FeedItem = { title?: string; link?: string; pubDate?: string };

function extractItems(xml: string): FeedItem[] {
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);
  const items = parsed?.rss?.channel?.item ?? parsed?.feed?.entry ?? [];
  const list = Array.isArray(items) ? items : [items];

  return list
    .filter(Boolean)
    .map((raw: Record<string, unknown>) => ({
      title: typeof raw.title === "string" ? raw.title : (raw.title as { "#text"?: string })?.["#text"],
      link:
        typeof raw.link === "string"
          ? raw.link
          : ((raw.link as { "@_href"?: string })?.["@_href"] ?? undefined),
      pubDate: (raw.pubDate as string) ?? (raw.updated as string) ?? (raw.published as string),
    }));
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (secret && authHeader !== `Bearer ${secret}`) {
    return Response.json({ error: "não autorizado" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: sources, error: sourcesError } = await supabase
    .from("news_sources")
    .select("*")
    .eq("active", true);

  if (sourcesError) {
    return Response.json({ error: sourcesError.message }, { status: 500 });
  }

  const results: { source: string; inseridos: number; erro?: string }[] = [];

  for (const source of sources ?? []) {
    try {
      const response = await fetch(source.rss_url, {
        headers: { "user-agent": "Industria360NewsBot/1.0" },
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const xml = await response.text();
      const items = extractItems(xml)
        .filter((item) => item.title && item.link)
        .slice(0, 30)
        .map((item) => ({
          source_id: source.id,
          title: item.title!.trim(),
          link: item.link!.trim(),
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
        }));

      if (items.length === 0) {
        results.push({ source: source.name, inseridos: 0 });
        continue;
      }

      const { error: upsertError, count } = await supabase
        .from("news_items")
        .upsert(items, { onConflict: "source_id,link", ignoreDuplicates: true, count: "exact" });

      if (upsertError) throw upsertError;

      results.push({ source: source.name, inseridos: count ?? items.length });
    } catch (err) {
      results.push({
        source: source.name,
        inseridos: 0,
        erro: err instanceof Error ? err.message : "erro desconhecido",
      });
    }
  }

  return Response.json({ ok: true, resultados: results });
}
