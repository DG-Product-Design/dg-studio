import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";
/** Switches from a 2:1 split to stacked panels based on its own width, without media queries. */
export function HolyAlbatross({
  main,
  aside,
  breakpoint = "60rem",
  className,
  style,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  main: ReactNode;
  aside: ReactNode;
  breakpoint?: string;
}) {
  return (
    <div
      {...props}
      className={cn("dg-albatross", className)}
      style={
        { "--dg-albatross-breakpoint": breakpoint, ...style } as CSSProperties
      }
    >
      <div className="dg-albatross-main">{main}</div>
      <div className="dg-albatross-aside">{aside}</div>
    </div>
  );
}
