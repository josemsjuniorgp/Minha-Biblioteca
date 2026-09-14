"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login, type AuthState } from "@/lib/actions/auth";

const initialState: AuthState = { error: null };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const searchParams = useSearchParams();
  const proximo = searchParams.get("proximo") ?? "/inicio";

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="font-heading text-lg font-semibold uppercase tracking-wide text-brand-ink"
        >
          Indústria 360
        </Link>
        <h1 className="mt-6 font-heading text-3xl font-semibold uppercase tracking-tight text-brand-ink">
          Entrar
        </h1>
        <p className="mt-1 text-sm text-muted">
          Acesse sua conta para ver conteúdo e notícias personalizadas.
        </p>

        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <input type="hidden" name="proximo" value={proximo} />

          <label className="flex flex-col gap-1 text-sm">
            E-mail
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="rounded-md border border-border bg-card px-3 py-2 text-brand-ink outline-none focus:border-brand-amber"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Senha
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="rounded-md border border-border bg-card px-3 py-2 text-brand-ink outline-none focus:border-brand-amber"
            />
          </label>

          {state.error && (
            <p className="text-sm text-red-700" role="alert">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-md bg-brand-ink px-4 py-2 font-medium text-white transition-colors hover:bg-brand-amber disabled:opacity-60"
          >
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-medium text-brand-ink underline">
            Cadastre-se grátis
          </Link>
        </p>
      </div>
    </main>
  );
}
