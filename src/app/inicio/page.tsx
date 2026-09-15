import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";

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

const NEWS_CATEGORY_LABEL: Record<string, string> = {
  politica: "Política",
  mercado: "Mercado",
  tecnica: "Técnicas",
  esporte: "Esporte",
};

export default async function InicioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { data: profile, error: profileError },
    { data: content },
    { data: sources },
    { data: newsItems },
  ] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("content")
        .select("*")
        .eq("status", "publicado")
        .order("created_at", { ascending: false })
        .limit(24),
      supabase.from("news_sources").select("*").eq("active", true),
      supabase
        .from("news_items")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(60),
    ]);

  const sourceById = new Map((sources ?? []).map((s) => [s.id, s]));
  const news = (newsItems ?? []).map((item) => ({
    ...item,
    source: sourceById.get(item.source_id),
  }));

  const timeDoCoracao = profile?.time_do_coracao?.trim().toLowerCase();
  const noticiasDoTime = timeDoCoracao
    ? news.filter((n) => n.source?.team_slug?.toLowerCase() === timeDoCoracao)
    : [];
  const noticiasGerais = news.filter((n) => n.source && n.source.category !== "esporte_time");

  return (
    <>
      <AppHeader nome={profile?.nome ?? "usuário"} isAdmin={Boolean(profile?.admin_role)} />
      <main className="flex-1 px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-12">
          {profileError && (
            <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800">
              <strong>Debug temporário — erro ao buscar perfil:</strong>
              <br />
              código: {profileError.code} · {profileError.message}
              <br />
              details: {profileError.details} · hint: {profileError.hint}
              <br />
              user.id consultado: {user.id}
            </div>
          )}
          <section>
            <h1 className="font-heading text-3xl font-semibold uppercase tracking-tight text-brand-ink">
              Olá, {profile?.nome?.split(" ")[0] ?? ""}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {profile?.cidade && profile?.estado
                ? `${profile.cidade} · ${profile.estado} · `
                : ""}
              Plano {TIER_LABEL.gratuito}
            </p>
          </section>

          {timeDoCoracao && (
            <section>
              <h2 className="font-heading text-xl font-semibold uppercase tracking-tight text-brand-ink">
                Notícias do {profile?.time_do_coracao}
              </h2>
              <NewsList items={noticiasDoTime} emptyLabel="Sem notícias do seu time por enquanto." />
            </section>
          )}

          <section>
            <h2 className="font-heading text-xl font-semibold uppercase tracking-tight text-brand-ink">
              Notícias
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(NEWS_CATEGORY_LABEL).map(([category, label]) => (
                <div key={category}>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {label}
                  </h3>
                  <NewsList
                    items={noticiasGerais.filter((n) => n.source?.category === category).slice(0, 5)}
                    emptyLabel="Sem novidades."
                    compact
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold uppercase tracking-tight text-brand-ink">
              Cursos, artigos, aulas e materiais
            </h2>
            {content && content.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {content.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-lg border border-border bg-card p-5"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
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
                    </div>
                    <h3 className="mt-3 font-heading text-lg font-semibold text-brand-ink">
                      {item.title}
                    </h3>
                    {item.summary && (
                      <p className="mt-2 text-sm text-brand-ink/70">{item.summary}</p>
                    )}
                    <p className="mt-3 text-xs text-muted">{item.theme}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted">
                Ainda não há conteúdo publicado para o seu nível de acesso.
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function NewsList({
  items,
  emptyLabel,
  compact = false,
}: {
  items: { id: string; title: string; link: string; source?: { name: string } }[];
  emptyLabel: string;
  compact?: boolean;
}) {
  if (items.length === 0) {
    return <p className="mt-2 text-sm text-muted">{emptyLabel}</p>;
  }

  return (
    <ul className={`mt-2 flex flex-col gap-2 ${compact ? "text-sm" : ""}`}>
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-ink hover:text-brand-amber hover:underline"
          >
            {item.title}
          </a>
          {item.source && <span className="ml-1 text-xs text-muted">— {item.source.name}</span>}
        </li>
      ))}
    </ul>
  );
}
