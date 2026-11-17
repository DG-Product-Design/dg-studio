import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";
export interface TotalOdometerProps {
  value: number;
  currency?: string;
  locale?: string;
  className?: string;
}
/** Intl owns currency formatting; digit columns only own the visual transition. */
export function TotalOdometer({
  value,
  currency = "USD",
  locale = "en-US",
  className,
}: TotalOdometerProps) {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(Number.isFinite(value) ? value : 0);
  return (
    <span
      className={cn(
        "inline-flex items-baseline text-5xl font-semibold tabular-nums",
        className,
      )}
    >
      <span className="sr-only">{formatted}</span>
      <span aria-hidden="true">
        {Array.from(formatted).map((char, i) =>
          /\d/.test(char) ? (
            <span className="dg-digit" key={`${formatted.length - i}-digit`}>
              <span
                className="dg-digit-strip"
                style={{ transform: `translateY(-${Number(char) * 10}%)` }}
              >
                {Array.from({ length: 10 }, (_, n) => (
                  <span key={n}>{n}</span>
                ))}
              </span>
            </span>
          ) : (
            <span key={`${formatted.length - i}-mark`}>{char}</span>
          ),
        )}
      </span>
    </span>
  );
}
export function GenerationStatus({
  label = "Updating your creative…",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { label?: string }) {
  return (
    <div
      {...props}
      role="status"
      className={cn(
        "flex items-center gap-3 text-sm text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="dg-loader grid size-8 shrink-0 grid-cols-3 gap-1"
      >
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} className="rounded-[2px] bg-primary" />
        ))}
      </span>
      {label}
    </div>
  );
}
