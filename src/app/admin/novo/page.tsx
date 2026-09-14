"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createContent, type ContentFormState } from "@/lib/actions/content";

const initialState: ContentFormState = { error: null };

const inputClass =
  "rounded-md border border-border bg-card px-3 py-2 text-brand-ink outline-none focus:border-brand-amber";

export default function NovoConteudoPage() {
  const [state, formAction, pending] = useActionState(createContent, initialState);

  return (
    <main className="flex-1 px-6 py-10 sm:px-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <Link href="/admin" className="text-sm text-muted hover:text-brand-ink">
            ← Painel administrativo
          </Link>
          <h1 className="mt-2 font-heading text-3xl font-semibold uppercase tracking-tight text-brand-ink">
            Novo conteúdo
          </h1>
          <p className="mt-1 text-sm text-muted">
            Vai para a fila de aprovação de outro administrador antes de ficar público.
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm">
              Tipo
              <select name="type" required className={inputClass} defaultValue="artigo">
                <option value="curso">Curso</option>
                <option value="artigo">Artigo</option>
                <option value="aula">Aula</option>
                <option value="material">Material</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Nível de acesso
              <select name="tier" required className={inputClass} defaultValue="gratuito">
                <option value="gratuito">Gratuito</option>
                <option value="prata">Prata</option>
                <option value="ouro">Ouro</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm">
            Título
            <input name="title" required className={inputClass} />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Tema
            <input name="theme" required placeholder="Ex.: Segurança do trabalho" className={inputClass} />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Resumo
            <textarea name="summary" rows={2} className={inputClass} />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Conteúdo (texto, para artigos)
            <textarea name="body" rows={6} className={inputClass} />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Link do vídeo (YouTube, para aulas)
            <input name="external_url" type="url" className={inputClass} />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="issues_certificate" className="h-4 w-4" />
            Emite certificado de conclusão
          </label>

          {state.error && (
            <p className="text-sm text-red-700" role="alert">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-md bg-brand-ink px-4 py-2 font-medium text-white hover:bg-brand-amber disabled:opacity-60"
          >
            {pending ? "Enviando…" : "Enviar para aprovação"}
          </button>
        </form>
      </div>
    </main>
  );
}
