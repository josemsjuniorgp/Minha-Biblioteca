// Mostrador circular — o "360°" da marca representado como um dial que
// vai se preenchendo a cada nível (Gratuito → Prata → Ouro).

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TierDial({
  percent,
  colorClass,
}: {
  percent: number;
  colorClass: string;
}) {
  const filled = (percent / 100) * CIRCUMFERENCE;

  return (
    <svg viewBox="0 0 40 40" className={`h-10 w-10 ${colorClass}`} aria-hidden="true">
      <circle
        cx="20"
        cy="20"
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="3"
      />
      <circle
        cx="20"
        cy="20"
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
        transform="rotate(-90 20 20)"
      />
    </svg>
  );
}
