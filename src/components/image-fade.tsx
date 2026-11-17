import {
  useCallback,
  useState,
  type CSSProperties,
  type ImgHTMLAttributes,
} from "react";
import { ImageOff } from "lucide-react";
import { cn } from "../lib/utils";
export interface ImageFadeProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "width" | "height" | "src" | "alt"
> {
  src: string;
  alt: string;
  width: number;
  height: number;
  imageClassName?: string;
  /** Container ratio; defaults to width / height. Accepts a number or CSS ratio. */
  aspectRatio?: CSSProperties["aspectRatio"];
  /** Fit the complete image and fill unused space with a blurred copy. */
  blurBg?: boolean;
}
/** Reserves space, handles cached images, and resets loading state for each source. */
export function ImageFade({
  src,
  alt,
  width,
  height,
  className,
  imageClassName,
  aspectRatio,
  blurBg = false,
  onLoad,
  onError,
  ...props
}: ImageFadeProps) {
  const [state, setState] = useState<{
    src: string;
    status: "loaded" | "error";
  }>();
  const status = state?.src === src ? state.status : "loading";
  const ref = useCallback(
    (node: HTMLImageElement | null) => {
      if (node?.complete && node.naturalWidth > 0)
        setState({ src, status: "loaded" });
    },
    [src],
  );
  return (
    <div
      className={cn("relative overflow-hidden rounded-lg bg-muted", className)}
      style={{ aspectRatio: aspectRatio ?? `${width}/${height}` }}
      data-image-state={status}
    >
      {status === "loading" && (
        <div
          aria-hidden
          className="absolute inset-0 motion-safe:animate-pulse bg-muted"
        />
      )}
      {status === "error" && (
        <div
          role="img"
          aria-label={`${alt}. Image unavailable.`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-sm text-muted-foreground"
        >
          <ImageOff aria-hidden />
          <span>Image unavailable</span>
        </div>
      )}
      {blurBg && status !== "error" && (
        <img
          key={`background-${src}`}
          src={src}
          srcSet={props.srcSet}
          sizes={props.sizes}
          loading={props.loading}
          decoding={props.decoding}
          crossOrigin={props.crossOrigin}
          referrerPolicy={props.referrerPolicy}
          alt=""
          aria-hidden="true"
          draggable={false}
          data-image-background
          className={cn(
            "pointer-events-none absolute inset-0 size-full scale-110 object-cover blur-xl motion-safe:transition-opacity motion-safe:duration-500",
            status === "loaded" ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      <img
        {...props}
        key={src}
        ref={ref}
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={(e) => {
          setState({ src, status: "loaded" });
          onLoad?.(e);
        }}
        onError={(e) => {
          setState({ src, status: "error" });
          onError?.(e);
        }}
        className={cn(
          "absolute inset-0 size-full object-cover motion-safe:transition-opacity motion-safe:duration-500",
          status === "loaded" ? "opacity-100" : "opacity-0",
          status === "error" && "hidden",
          imageClassName,
          blurBg && "object-contain",
        )}
      />
    </div>
  );
}
