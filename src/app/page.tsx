import Link from "next/link";
import { TierDial } from "@/components/tier-dial";

const TIERS = [
  {
    nome: "Gratuito",
    cor: "border-tier-free text-tier-free",
    percent: 34,
    itens: ["Cursos, artigos, aulas e materiais gratuitos", "Notícias personalizadas por região, área e time do coração"],
  },
  {
    nome: "Prata",
    cor: "border-tier-silver text-tier-silver",
    percent: 67,
    itens: ["Tudo do Gratuito", "Conteúdo exclusivo nível Prata"],
  },
  {
    nome: "Ouro",
    cor: "border-tier-gold text-tier-gold",
    percent: 100,
    itens: ["Tudo do Gratuito e do Prata", "Conteúdo exclusivo nível Ouro"],
  },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      <div
        className="bg-background bg-[length:32px_32px]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--brand-ink) 5%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--brand-ink) 5%, transparent) 1px, transparent 1px)",
        }}
      >
        <header className="flex items-center justify-between px-6 py-5 sm:px-10">
          <span className="font-heading text-lg font-semibold uppercase tracking-wide text-brand-ink">
            Indústria 360
          </span>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/login" className="text-brand-ink hover:text-brand-amber">
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="rounded-md bg-brand-ink px-4 py-2 font-medium text-white hover:bg-brand-amber"
            >
              Criar conta grátis
            </Link>
          </nav>
        </header>

        <section className="relative overflow-hidden px-6 py-16 sm:px-10 sm:py-24">
          <svg
            viewBox="0 0 400 400"
            aria-hidden="true"
            className="pointer-events-none absolute right-[-80px] top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 text-brand-ink/10 lg:block"
          >
            <circle cx="200" cy="200" r="170" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="130" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              const rad = (angle * Math.PI) / 180;
              const x1 = 200 + Math.cos(rad) * 170;
              const y1 = 200 + Math.sin(rad) * 170;
              const x2 = 200 + Math.cos(rad) * (i % 6 === 0 ? 150 : 160);
              const y2 = 200 + Math.sin(rad) * (i % 6 === 0 ? 150 : 160);
              return (
                <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5" />
              );
            })}
            <circle cx="200" cy="200" r="4" fill="currentColor" />
          </svg>

          <div className="relative mx-auto max-w-3xl">
            <p className="font-heading text-sm font-medium uppercase tracking-[0.2em] text-brand-amber">
              Para quem faz a indústria funcionar
            </p>
            <h1 className="mt-3 font-heading text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-6xl">
              Conteúdo técnico e notícias em um só lugar
            </h1>
            <p className="mt-6 max-w-xl text-lg text-brand-ink/80">
              Cursos, artigos, aulas e materiais para estudantes de engenharia,
              engenheiros, gerentes, coordenadores, diretores, mantenedores e
              quem mais trabalha na indústria — com uma página inicial que se
              adapta a você.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cadastro"
                className="rounded-md bg-brand-amber px-6 py-3 font-medium text-brand-ink hover:brightness-95"
              >
                Criar conta grátis
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-border px-6 py-3 font-medium text-brand-ink hover:border-brand-ink"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </section>
      </div>

      <section className="border-t border-border bg-card px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-semibold uppercase tracking-tight text-brand-ink">
            Três níveis, um só cadastro
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.nome}
                className={`rounded-lg border-t-4 bg-background p-6 transition-shadow hover:shadow-md ${tier.cor}`}
              >
                <div className="flex items-center gap-3">
                  <TierDial percent={tier.percent} colorClass={tier.cor.split(" ")[1]} />
                  <h3 className="font-heading text-xl font-semibold uppercase">{tier.nome}</h3>
                </div>
                <ul className="mt-4 flex flex-col gap-2 text-sm text-brand-ink/80">
                  {tier.itens.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-10 text-sm text-muted sm:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <span className="font-heading font-semibold uppercase tracking-wide text-brand-ink">
            Indústria 360
          </span>
          <span>© {new Date().getFullYear()} — feito para quem faz a indústria funcionar</span>
        </div>
      </footer>
    </main>
  );
}
