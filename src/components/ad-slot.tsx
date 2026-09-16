// Placeholder visual para espaços de publicidade — ainda sem rede de
// anúncios conectada (ver observação do usuário: "só reservar o espaço
// por enquanto"). Trocar o conteúdo interno pelo script real (AdSense
// ou banner interno) quando essa decisão for tomada; o tamanho de cada
// formato já segue os padrões IAB, prontos para receber a unidade real.

const FORMAT = {
  leaderboard: { width: 728, height: 90, label: "728×90" },
  rectangle: { width: 300, height: 250, label: "300×250" },
  sidebar: { width: 300, height: 600, label: "300×600" },
} as const;

export function AdSlot({ format }: { format: keyof typeof FORMAT }) {
  const { width, height, label } = FORMAT[format];

  return (
    <div
      aria-hidden="true"
      className="mx-auto flex w-full items-center justify-center rounded-md border border-dashed border-border bg-card/60 text-center"
      style={{ maxWidth: width, aspectRatio: `${width} / ${height}` }}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-muted">
        Espaço publicitário · {label}
      </span>
    </div>
  );
}
