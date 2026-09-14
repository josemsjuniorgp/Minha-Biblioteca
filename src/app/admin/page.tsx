import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { approveContent, rejectContent } from "@/lib/actions/content";

const STATUS_LABEL: Record<string, string> = {
  em_aprovacao: "Aguardando aprovação",
  publicado: "Publicado",
  reprovado: "Reprovado",
  rascunho: "Rascunho",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile?.admin_role) {
    redirect("/inicio");
  }

  const { data: content } = await supabase
    .from("content")
    .select("*")
    .order("created_at", { ascending: false });

  const pendentes = (content ?? []).filter((c) => c.status === "em_aprovacao");
  const outros = (content ?? []).filter((c) => c.status !== "em_aprovacao");

  return (
    <>
      <AppHeader nome={profile.nome} isAdmin />
      <main className="flex-1 px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-semibold uppercase tracking-tight text-brand-ink">
                Painel administrativo
              </h1>
              <p className="mt-1 text-sm text-muted">
                {profile.admin_role === "administrador_total"
                  ? "Administrador Total"
                  : "Administrador Geral"}
              </p>
            </div>
            <Link
              href="/admin/novo"
              className="rounded-md bg-brand-ink px-4 py-2 text-sm font-medium text-white hover:bg-brand-amber"
            >
              Novo conteúdo
            </Link>
          </div>

          <section>
            <h2 className="font-heading text-xl font-semibold uppercase tracking-tight text-brand-ink">
              Aguardando aprovação ({pendentes.length})
            </h2>
            {pendentes.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Nenhum conteúdo na fila.</p>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {pendentes.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                  >
                    <div>
                      <p className="font-medium text-brand-ink">{item.title}</p>
                      <p className="text-xs text-muted">
                        {item.type} · {item.theme} · nível {item.tier}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <form
                        action={async () => {
                          "use server";
                          await approveContent(item.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded-md bg-tier-free px-3 py-1.5 text-sm font-medium text-white hover:brightness-110"
                        >
                          Aprovar
                        </button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await rejectContent(item.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-brand-ink hover:border-brand-ink"
                        >
                          Reprovar
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold uppercase tracking-tight text-brand-ink">
              Todo o conteúdo
            </h2>
            {outros.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Nada por aqui ainda.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                      <th className="py-2 pr-4">Título</th>
                      <th className="py-2 pr-4">Tipo</th>
                      <th className="py-2 pr-4">Nível</th>
                      <th className="py-2 pr-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outros.map((item) => (
                      <tr key={item.id} className="border-b border-border/60">
                        <td className="py-2 pr-4 text-brand-ink">{item.title}</td>
                        <td className="py-2 pr-4 text-muted">{item.type}</td>
                        <td className="py-2 pr-4 text-muted">{item.tier}</td>
                        <td className="py-2 pr-4 text-muted">{STATUS_LABEL[item.status]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
