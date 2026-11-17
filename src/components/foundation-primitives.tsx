import {
  Component,
  useId,
  type AnchorHTMLAttributes,
  type ErrorInfo,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Banner, type FeedbackTone } from "./feedback";
import { cn } from "../lib/utils";
export function Heading({
  level = 2,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }) {
  const Tag = `h${level}` as "h1";
  return (
    <Tag
      {...props}
      className={cn(
        "font-semibold tracking-tight",
        level === 1
          ? "text-3xl"
          : level === 2
            ? "text-2xl"
            : level === 3
              ? "text-xl"
              : "text-base",
        className,
      )}
    />
  );
}
export function Text({
  as: Tag = "p",
  muted = false,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  as?: "p" | "span" | "strong" | "em";
  muted?: boolean;
}) {
  return (
    <Tag
      {...props}
      className={cn(
        "text-sm leading-relaxed",
        muted && "text-muted-foreground",
        className,
      )}
    />
  );
}
export function Link({
  className,
  target,
  rel,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      target={target}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      className={cn(
        "rounded text-primary underline underline-offset-4",
        className,
      )}
    />
  );
}
export function List({
  ordered = false,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLOListElement> & { ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      {...props}
      className={cn(
        "space-y-2 pl-6 text-sm",
        ordered ? "list-decimal" : "list-disc",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
export function CountBadge({
  count,
  tone = "info",
}: {
  count: number;
  tone?: FeedbackTone;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "tabular-nums",
        tone === "danger"
          ? "text-destructive"
          : tone === "success"
            ? "text-success"
            : tone === "warning"
              ? "text-warning"
              : "text-primary",
      )}
    >
      {new Intl.NumberFormat().format(count)}
    </Badge>
  );
}
export function Activity({
  status = "inactive",
}: {
  status?: "active" | "inactive" | "pending";
}) {
  return (
    <span className="inline-flex items-center gap-2 text-xs">
      <span
        aria-hidden
        className={cn(
          "size-2 rounded-full",
          status === "active"
            ? "bg-success"
            : status === "pending"
              ? "bg-warning"
              : "bg-muted-foreground",
        )}
      />
      {status === "active"
        ? "Active"
        : status === "pending"
          ? "Pending"
          : "Inactive"}
    </span>
  );
}
export function Flag({
  children,
  tone = "danger",
}: {
  children: ReactNode;
  tone?: FeedbackTone;
}) {
  return (
    <Banner
      title={typeof children === "string" ? children : "Notice"}
      tone={tone}
    >
      {typeof children === "string" ? undefined : children}
    </Banner>
  );
}
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" width={size} height={size}>
      <rect x="1" y="1" width="62" height="62" rx="14" fill="var(--primary)" />
      <text
        x="32"
        y="39"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fill="var(--primary-foreground)"
      >
        D.G
      </text>
    </svg>
  );
}
export function Logo({
  href = "/",
  collapsed = false,
  src,
  alt = "D.G Studio home",
}: {
  href?: string;
  collapsed?: boolean;
  src?: string;
  alt?: string;
}) {
  return (
    <a
      href={href}
      aria-label={collapsed ? alt : undefined}
      className="inline-flex items-center gap-3 rounded"
    >
      {src ? (
        <img src={src} alt="" className="size-10 object-contain" />
      ) : (
        <LogoMark />
      )}
      {!collapsed && <span className="font-semibold">D.G Studio</span>}
    </a>
  );
}
export function CardNextButton({
  title,
  description,
  onClick,
  disabled = false,
}: {
  title: string;
  description?: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-between gap-5 rounded-xl border bg-card p-5 text-left hover:border-primary disabled:opacity-50"
    >
      <span className="font-semibold">
        {title}
        {description && (
          <span className="mt-1 block text-sm font-normal text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      <ArrowRight aria-hidden className="size-5 shrink-0" />
    </button>
  );
}
export function InputRegion({
  label,
  children,
  disabled = false,
  error,
}: {
  label: string;
  children: ReactNode;
  disabled?: boolean;
  error?: string;
}) {
  const id = useId();
  return (
    <fieldset
      disabled={disabled}
      aria-describedby={error ? id : undefined}
      className="space-y-3 rounded-lg border p-4 disabled:opacity-50"
    >
      <legend className="px-2 text-sm font-semibold">{label}</legend>
      {children}
      {error && (
        <p id={id} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
}
export function FormHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
export function FormNote({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs leading-relaxed text-muted-foreground">{children}</p>
  );
}
export class ErrorBoundary extends Component<
  {
    children: ReactNode;
    onError?: (error: Error, info: ErrorInfo) => void;
    fallback?: ReactNode;
  },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }
  render() {
    return this.state.error
      ? (this.props.fallback ?? (
          <Banner
            title="This view couldn’t load"
            tone="danger"
            action={
              <Button
                type="button"
                onClick={() => this.setState({ error: null })}
              >
                Try again
              </Button>
            }
          >
            Refresh this view or try again.
          </Banner>
        ))
      : this.props.children;
  }
}
export function ScannableCode({
  src,
  alt,
  size = 180,
}: {
  src: string;
  alt: string;
  size?: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="max-w-full rounded bg-white p-3 object-contain"
    />
  );
}
