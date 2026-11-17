import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "../lib/utils";
export interface ColorFlowProps extends HTMLAttributes<HTMLDivElement> {
  from?: string;
  to?: string;
  duration?: number;
  interpolation?: "oklch" | "srgb";
  dither?: boolean;
  paused?: boolean;
}
/** A moving color field with perceptual interpolation and a static dithering layer. */
export function ColorFlow({
  from = "#e0eff5",
  to = "#8deecb",
  duration = 10000,
  interpolation = "oklch",
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
      className={cn("dg-color-flow", className)}
      data-space={interpolation}
      data-dither={dither}
      data-paused={paused}
      style={
        {
          "--dg-flow-from": from,
          "--dg-flow-to": to,
          "--dg-flow-duration": `${Math.max(1000, duration)}ms`,
          ...style,
        } as CSSProperties
      }
    >
      <div aria-hidden className="dg-color-field" />
      <div aria-hidden className="dg-color-noise" />
      <div className="dg-color-content">{children}</div>
    </div>
  );
}
