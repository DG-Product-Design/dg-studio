export function Coin({ size = 28, label = 'Points' }: { size?: number; label?: string }) {
  return (
    <svg role="img" aria-label={label} width={size} height={size} viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="var(--secondary)" stroke="var(--secondary-foreground)" />
      <circle cx="16" cy="16" r="10" fill="none" stroke="var(--secondary-foreground)" />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="var(--secondary-foreground)"
      >
        P
      </text>
    </svg>
  );
}
