import Link from "next/link";
import { logout } from "@/lib/actions/auth";

export function AppHeader({
  nome,
  isAdmin,
}: {
  nome: string;
  isAdmin: boolean;
}) {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-10">
      <Link
        href="/inicio"
        className="font-heading text-lg font-semibold uppercase tracking-wide text-brand-ink"
      >
        Indústria 360
      </Link>
      <nav className="flex items-center gap-4 text-sm text-brand-ink">
        <Link href="/inicio" className="hover:text-brand-amber">
          Início
        </Link>
        {isAdmin && (
          <Link href="/admin" className="hover:text-brand-amber">
            Painel admin
          </Link>
        )}
        <span className="text-muted">Olá, {nome.split(" ")[0]}</span>
        <form action={logout}>
          <button type="submit" className="text-muted hover:text-brand-ink">
            Sair
          </button>
        </form>
      </nav>
    </header>
  );
}
