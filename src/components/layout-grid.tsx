import { useState, type CSSProperties, type HTMLAttributes } from "react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
type Span = number | { mobile: number; desktop: number };
const pair = (value: Span) =>
  typeof value === "number" ? [value, value] : [value.mobile, value.desktop];
export function MarketplaceGrid({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6", className)}
    />
  );
}
export function Row({
  columns = { mobile: 12, desktop: 16 },
  gap = 16,
  debug = false,
  style,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  columns?: Span;
  gap?: number;
  debug?: boolean;
}) {
  const [mobile, desktop] = pair(columns);
  return (
    <div
      {...props}
      data-debug={debug || undefined}
      className={cn("dg-row", className)}
      style={
        {
          "--dg-columns-mobile": mobile,
          "--dg-columns-desktop": desktop,
          "--dg-grid-gap": `${gap}px`,
          ...style,
        } as CSSProperties
      }
    />
  );
}
export function Column({
  span = { mobile: 12, desktop: 8 },
  offset = 0,
  fill = false,
  debug = false,
  className,
  style,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  span?: Span;
  offset?: Span;
  fill?: boolean;
  debug?: boolean;
}) {
  const [mobile, desktop] = pair(span),
    [offMobile, offDesktop] = pair(offset);
  return (
    <div
      {...props}
      className={cn("dg-column min-w-0", className)}
      data-fill={fill || undefined}
      data-debug={debug || undefined}
      style={
        {
          "--dg-span-mobile": mobile,
          "--dg-span-desktop": desktop,
          "--dg-offset-mobile": offMobile,
          "--dg-offset-desktop": offDesktop,
          ...style,
        } as CSSProperties
      }
    >
      {debug && (
        <span className="mb-2 block text-xs">
          {mobile} / {desktop} columns
        </span>
      )}
      {children}
    </div>
  );
}
export function GridHelper({
  children,
  defaultVisible = false,
}: {
  children: React.ReactNode;
  defaultVisible?: boolean;
}) {
  const [visible, setVisible] = useState(defaultVisible);
  return (
    <div className="space-y-4">
      <Button
        type="button"
        size="sm"
        variant="outline"
        aria-pressed={visible}
        onClick={() => setVisible(!visible)}
      >
        Toggle grid overlay
      </Button>
      <div className="relative">
        {children}
        {visible && (
          <div
            aria-hidden
            className="dg-grid-overlay pointer-events-none absolute inset-0 grid gap-4"
          >
            {Array.from({ length: 16 }, (_, i) => (
              <span
                key={i}
                className="border-x border-primary/40 bg-primary/10 text-center text-xs"
              >
                {i + 1}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
