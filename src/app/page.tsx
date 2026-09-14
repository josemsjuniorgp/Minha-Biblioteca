import Link from "next/link";

const TIERS = [
  {
    nome: "Gratuito",
    cor: "border-tier-free text-tier-free",
    itens: ["Cursos, artigos, aulas e materiais gratuitos", "Notícias personalizadas por região, área e time do coração"],
  },
  {
    nome: "Prata",
    cor: "border-tier-silver text-tier-silver",
    itens: ["Tudo do Gratuito", "Conteúdo exclusivo nível Prata"],
  },
  {
    nome: "Ouro",
    cor: "border-tier-gold text-tier-gold",
    itens: ["Tudo do Gratuito e do Prata", "Conteúdo exclusivo nível Ouro"],
  },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
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

      <section className="px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-3xl">
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

      <section className="border-t border-border bg-card px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-semibold uppercase tracking-tight text-brand-ink">
            Três níveis, um só cadastro
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TIERS.map((tier) => (
              <div key={tier.nome} className={`rounded-lg border-t-4 bg-background p-6 ${tier.cor}`}>
                <h3 className="font-heading text-xl font-semibold uppercase">{tier.nome}</h3>
                <ul className="mt-4 flex flex-col gap-2 text-sm text-brand-ink/80">
                  {tier.itens.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-sm text-muted sm:px-10">
        Indústria 360
      </footer>
    </main>
  );
}
