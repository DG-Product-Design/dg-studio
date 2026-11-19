import type { CSSProperties, HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export interface ColorFlowProps extends HTMLAttributes<HTMLDivElement> {
  from?: string;
  to?: string;
  /** Text color for content over the gradient. */
  foreground?: string;
  /** Milliseconds per one-way drift (minimum 1,000). A round trip takes twice this. */
  duration?: number;
  /** CSS easing for each one-way drift. */
  timingFunction?: CSSProperties['animationTimingFunction'];
  interpolation?: 'oklch' | 'srgb';
  dither?: boolean;
  paused?: boolean;
}

/** A moving color field with perceptual interpolation and a static dithering layer. */
export function ColorFlow({
  from = '#e0eff5',
  to = '#8deecb',
  foreground = '#153c35',
  duration = 10000,
  timingFunction = 'ease-in-out',
  interpolation = 'oklch',
  dither = true,
  paused = false,
  className,
  style,
  children,
  ...props
}: ColorFlowProps) {
  return (
    <div
      {...props}
      className={cn(
        'dg-color-flow relative isolate min-h-64 overflow-hidden rounded-2xl bg-(--dg-flow-from)',
        className,
      )}
      data-space={interpolation}
      data-dither={dither}
      data-paused={paused}
      style={
        {
          '--dg-flow-from': from,
          '--dg-flow-to': to,
          '--dg-flow-foreground': foreground,
          '--dg-flow-timing': timingFunction,
          '--dg-flow-duration': `${Math.max(1000, duration)}ms`,
          ...style,
        } as CSSProperties
      }
    >
      <div aria-hidden className="dg-color-field absolute -inset-1/2 -z-2" />
      <div
        aria-hidden
        className="dg-color-noise pointer-events-none absolute inset-0 -z-1 opacity-[0.08] mix-blend-soft-light"
      />
      <div className="relative p-[clamp(1.5rem,5vw,3rem)] text-[color:var(--dg-flow-foreground)]">
        {children}
      </div>
    </div>
  );
}
