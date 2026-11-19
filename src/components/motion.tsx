import type { HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export interface TotalOdometerProps {
  value: number;
  currency?: string;
  locale?: string;
  className?: string;
}

/** Intl owns currency formatting; digit columns only own the visual transition. */
export function TotalOdometer({
  value,
  currency = 'USD',
  locale = 'en-US',
  className,
}: TotalOdometerProps) {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(Number.isFinite(value) ? value : 0);

  return (
    <span
      className={cn('inline-flex items-baseline text-5xl font-semibold tabular-nums', className)}
    >
      <span className="sr-only">{formatted}</span>
      <span aria-hidden="true">
        {Array.from(formatted).map((char, i) =>
          /\d/.test(char) ? (
            <span
              className="inline-block h-[1.15em] w-[0.64em] overflow-hidden align-bottom"
              key={`${formatted.length - i}-digit`}
            >
              <span
                className="flex flex-col transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transform: `translateY(-${Number(char) * 10}%)` }}
              >
                {Array.from({ length: 10 }, (_, n) => (
                  <span key={n} className="h-[1.15em] text-center leading-[1.15em]">
                    {n}
                  </span>
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
  label = 'Updating your creative…',
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { label?: string }) {
  return (
    <div
      {...props}
      role="status"
      className={cn('flex items-center gap-3 text-sm text-muted-foreground', className)}
    >
      <span
        aria-hidden="true"
        data-generation-indicator
        className="grid size-5 shrink-0 grid-cols-3 gap-1"
      >
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className="rounded-[2px] bg-primary animate-[dg-cube_1200ms_ease-in-out_infinite_alternate]"
            style={{ animationDelay: `${-400 * ((i + 1) % 3)}ms` }}
          />
        ))}
      </span>
      {label}
    </div>
  );
}
