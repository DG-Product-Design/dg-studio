import { useId, type CSSProperties } from "react";
/** D.G’s rotating, drawing-circle spinner. */
export function Spinner({
  label = "Loading",
  size = 32,
  color = "var(--spinner-color, var(--primary))",
}: {
  label?: string;
  size?: number;
  color?: CSSProperties["color"];
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className="inline-flex shrink-0"
      style={{ color }}
    >
      <svg
        aria-hidden
        width={size}
        height={size}
        viewBox="57 57 146 146"
        fill="none"
        className="dg-drawing-spinner"
      >
        <circle
          cx="130"
          cy="130"
          r="65"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
/** The original marketplace reveal: a rotating F, growing mask, and two traveling waves. */
export interface LoaderProps {
  label?: string;
  size?: number;
  backgroundColor?: string;
  foregroundColor?: string;
  scaleDuration?: number;
  startScale?: number;
  waveDuration?: number;
  /** @deprecated Use waveDuration. Retained for existing library consumers. */
  duration?: number;
}
export function Loader({
  label = "Loading",
  size = 150,
  backgroundColor = "var(--purple-700, #461276)",
  foregroundColor = "white",
  scaleDuration = 1000,
  startScale = 0.2,
  waveDuration,
  duration,
}: LoaderProps) {
  const maskId = useId();
  return (
    <span role="status" aria-label={label}>
      <svg
        aria-hidden
        width={size}
        height={(size * 178) / 150}
        viewBox="0 0 150 178"
        fill="currentColor"
        className="dg-fringe-loader"
        style={
          {
            color: backgroundColor,
            "--dg-loader-scale-duration": `${scaleDuration}ms`,
            "--dg-loader-start-scale": startScale,
            "--dg-wave-duration": `${waveDuration ?? duration ?? 6000}ms`,
          } as CSSProperties
        }
      >
        <mask id={maskId}>
          <rect
            className="dg-loader-mask"
            width="150"
            height="178"
            x="0"
            y="0"
          />
        </mask>
        <polygon points="112.4,48.3 112.4,30.3 45.5,30.3 45.5,120.1 65.2,120.1 65.2,84.5 95.4,84.5 95.4,66.4 65.2,66.4 65.2,48.3" />
        <g mask={`url(#${maskId})`}>
          <rect
            className="dg-loader-background"
            width="150"
            height="120"
            x="0"
            y="0"
          />
          <polygon
            fill={foregroundColor}
            points="112.4,48.3 112.4,30.3 45.5,30.3 45.5,120.1 65.2,120.1 65.2,84.5 95.4,84.5 95.4,66.4 65.2,66.4 65.2,48.3"
          />
          <path
            className="dg-wave"
            fill="currentColor"
            d="M750,119.3h-13.3H150H0v10c17.7,8.3,27.8,20,57.1,20c42.4,0,48-26.4,92.9-27.9c1.4,0,2.8-0.1,4.2-0.1 c52.3,0,51.8,28,97.1,28c43.7,0,48.3-28,97.1-28c52.3,0,51.8,28,97.1,28c43.7,0,48.3-28,97.1-28c52.3,0,51.8,28,97.1,28 c43.7,0,48.3-28,97.1-28c4.9,0,9.3,0.2,13.3,0.7V119.3z"
          />
          <path
            className="dg-wave"
            fill="currentColor"
            d="M750,136.7c-4-0.4-8.4-0.7-13.3-0.7c-48.8,0-53.4,28-97.1,28c-45.3,0-44.7-28-97.1-28c-48.8,0-53.4,28-97.1,28 c-45.3,0-44.7-28-97.1-28c-48.8,0-53.4,28-97.1,28c-45.3,0-44.7-28-97.1-28c-1.4,0-2.8,0-4.2,0.1c-44.9,1.6-50.5,27.9-92.9,27.9 c-29.3,0-39.4-11.7-57.1-20v13.8c17.7,8.3,27.8,20,57.1,20c42.4,0,48-26.4,92.9-27.9c1.4,0,2.8-0.1,4.2-0.1c52.3,0,51.8,28,97.1,28 c43.7,0,48.3-28,97.1-28c52.3,0,51.8,28,97.1,28c43.7,0,48.3-28,97.1-28c52.3,0,51.8,28,97.1,28c43.7,0,48.3-28,97.1-28 c4.9,0,9.3,0.2,13.3,0.7V136.7z"
          />
        </g>
      </svg>
    </span>
  );
}
