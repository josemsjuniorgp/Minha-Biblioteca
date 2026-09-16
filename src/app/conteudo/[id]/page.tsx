import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { AdSlot } from "@/components/ad-slot";
import { contentThemeLabel } from "@/lib/content-themes";

const TIER_LABEL: Record<string, string> = {
  gratuito: "Gratuito",
  prata: "Prata",
  ouro: "Ouro",
};

const CONTENT_TYPE_LABEL: Record<string, string> = {
  curso: "Curso",
  artigo: "Artigo",
  aula: "Aula",
  material: "Material",
};

function youtubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    if (parsed.hostname.includes("youtube.com") && parsed.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
    }
    return null;
  } catch {
    return null;
  }
}

export default async function ConteudoPage(props: PageProps<"/conteudo/[id]">) {
  const { id } = await props.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: item }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("content").select("*").eq("id", id).single(),
  ]);

  if (!item) {
    notFound();
  }

  const embedUrl = item.external_url ? youtubeEmbedUrl(item.external_url) : null;

  return (
    <>
      <AppHeader nome={profile?.nome ?? "usuário"} isAdmin={Boolean(profile?.admin_role)} />
      <main className="flex-1 px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <Link href="/inicio" className="text-sm text-muted hover:text-brand-ink">
            ← Início
          </Link>

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
              <span className="text-brand-amber">{CONTENT_TYPE_LABEL[item.type]}</span>
              <span
                className={
                  item.tier === "ouro"
                    ? "rounded bg-tier-gold-soft px-2 py-0.5 text-tier-gold"
                    : item.tier === "prata"
                      ? "rounded bg-tier-silver-soft px-2 py-0.5 text-tier-silver"
                      : "rounded bg-tier-free-soft px-2 py-0.5 text-tier-free"
                }
              >
                {TIER_LABEL[item.tier]}
              </span>
              {item.issues_certificate && (
                <span className="rounded bg-brand-amber/15 px-2 py-0.5 text-brand-ink">
                  Emite certificado
                </span>
              )}
            </div>
            <h1 className="mt-3 font-heading text-3xl font-semibold uppercase tracking-tight text-brand-ink">
              {item.title}
            </h1>
            <p className="mt-1 text-sm text-muted">{contentThemeLabel(item.theme)}</p>
          </div>

          {item.summary && <p className="text-lg text-brand-ink/80">{item.summary}</p>}

          {embedUrl && (
            <div className="aspect-video w-full overflow-hidden rounded-lg border border-border">
              <iframe
                src={embedUrl}
                title={item.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {item.external_url && !embedUrl && (
            <a
              href={item.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit rounded-md bg-brand-ink px-4 py-2 text-sm font-medium text-white hover:bg-brand-amber"
            >
              Abrir link
            </a>
          )}

          {item.file_path && (
            <a
              href={item.file_path}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit rounded-md border border-border px-4 py-2 text-sm font-medium text-brand-ink hover:border-brand-ink"
            >
              Baixar material
            </a>
          )}

          {item.body && (
            <p className="whitespace-pre-wrap text-base leading-relaxed text-brand-ink/90">
              {item.body}
            </p>
          )}

          <div className="border-t border-border pt-8">
            <AdSlot format="rectangle" />
          </div>
        </div>
      </main>
    </>
  );
}
