"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type AuthState } from "@/lib/actions/auth";

const initialState: AuthState = { error: null };

const inputClass =
  "rounded-md border border-border bg-card px-3 py-2 text-brand-ink outline-none focus:border-brand-amber";

export default function CadastroPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <Link
          href="/"
          className="font-heading text-lg font-semibold uppercase tracking-wide text-brand-ink"
        >
          Indústria 360
        </Link>
        <h1 className="mt-6 font-heading text-3xl font-semibold uppercase tracking-tight text-brand-ink">
          Criar conta grátis
        </h1>
        <p className="mt-1 text-sm text-muted">
          Usamos esses dados para personalizar sua página inicial — notícias
          do seu time, da sua região e da sua área de atuação.
        </p>

        <form action={formAction} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            Nome
            <input name="nome" required className={inputClass} />
          </label>

          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            E-mail
            <input type="email" name="email" required autoComplete="email" className={inputClass} />
          </label>

          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            Senha
            <input
              type="password"
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Cidade
            <input name="cidade" className={inputClass} />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Estado
            <input name="estado" placeholder="Ex.: SP" className={inputClass} />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Cargo
            <input name="cargo" className={inputClass} />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Área de atuação
            <input name="area_atuacao" placeholder="Ex.: Engenharia civil" className={inputClass} />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Time do coração
            <input name="time_do_coracao" className={inputClass} />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Esporte favorito
            <input name="esporte_favorito" className={inputClass} />
          </label>

          {state.error && (
            <p className="text-sm text-red-700 sm:col-span-2" role="alert">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-md bg-brand-ink px-4 py-2 font-medium text-white transition-colors hover:bg-brand-amber disabled:opacity-60 sm:col-span-2"
          >
            {pending ? "Criando conta…" : "Criar conta grátis"}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-brand-ink underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
