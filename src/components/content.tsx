import { useId, type HTMLAttributes, type ReactNode } from "react";
import { Avatar as AvatarPrimitive, Collapsible } from "radix-ui";
import { ChevronDown, TrendingUp, TrendingDown, X } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./feedback";
import { cn } from "../lib/utils";
export interface CardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  action?: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
}
export function Card({
  title,
  description,
  children,
  footer,
  action,
  collapsible = false,
  defaultOpen = true,
  className,
}: CardProps) {
  const id = useId();
  const body = (
    <>
      <div className="p-5">{children}</div>
      {footer && (
        <div className="flex flex-wrap items-center gap-3 border-t p-5">
          {footer}
        </div>
      )}
    </>
  );
  return (
    <Collapsible.Root defaultOpen={defaultOpen} asChild>
      <section
        aria-labelledby={id}
        className={cn("overflow-hidden rounded-xl border bg-card", className)}
      >
        <header className="flex items-start justify-between gap-3 border-b p-5">
          <div>
            <h2 id={id} className="font-semibold">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {action}
            {collapsible && (
              <Collapsible.Trigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Toggle ${title}`}
                  className="group"
                >
                  <ChevronDown
                    aria-hidden
                    className="transition-transform group-data-[state=open]:rotate-180"
                  />
                </Button>
              </Collapsible.Trigger>
            )}
          </div>
        </header>
        {collapsible ? <Collapsible.Content>{body}</Collapsible.Content> : body}
      </section>
    </Collapsible.Root>
  );
}
export function CardWithAction({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-5">
      {icon && (
        <span aria-hidden className="text-primary [&>svg]:size-6">
          {icon}
        </span>
      )}
      <div className="min-w-40 flex-1">
        <h3 className="font-semibold">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
export function MetricTile({
  label,
  value,
  description,
  change,
  loading = false,
  locale = "en-US",
}: {
  label: string;
  value: number;
  description?: string;
  change?: { label: string; direction: "up" | "down" };
  loading?: boolean;
  locale?: string;
}) {
  const Icon = change?.direction === "down" ? TrendingDown : TrendingUp;
  return (
    <section
      aria-label={label}
      aria-busy={loading}
      className="min-w-0 rounded-xl border bg-card p-5"
    >
      <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
      {loading ? (
        <>
          <Skeleton className="my-4 h-10 w-28" />
          <span className="sr-only">Loading {label}</span>
        </>
      ) : (
        <p
          className="my-3 text-4xl font-semibold tabular-nums"
          title={new Intl.NumberFormat(locale).format(value)}
        >
          {new Intl.NumberFormat(locale, {
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(value)}
        </p>
      )}
      {change && (
        <p className="flex items-center gap-2 text-sm">
          <Icon aria-hidden className="size-4 text-primary" />
          {change.label}
        </p>
      )}
      {description && (
        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      )}
    </section>
  );
}
export function Avatar({
  name,
  src,
  size = "md",
}: {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}) {
  const names = name.trim().split(/\s+/);
  const initials =
    names
      .filter((_, i) => i === 0 || i === names.length - 1)
      .map((n) => Array.from(n)[0] ?? "")
      .join("")
      .toUpperCase() || "?";
  return (
    <AvatarPrimitive.Root
      role="img"
      aria-label={name || "Unnamed person"}
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary font-semibold text-secondary-foreground",
        size === "sm"
          ? "size-8 text-xs"
          : size === "lg"
            ? "size-14 text-lg"
            : "size-10 text-sm",
      )}
    >
      <AvatarPrimitive.Image
        src={src}
        alt=""
        className="size-full object-cover"
      />
      <AvatarPrimitive.Fallback>{initials}</AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
export function TagList({
  tags,
  onRemove,
  label = "Tags",
}: {
  tags: string[];
  onRemove?: (tag: string) => void;
  label?: string;
}) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="inline-flex max-w-full items-center gap-1 rounded-full bg-secondary py-1 pr-2 pl-3 text-xs font-medium text-secondary-foreground"
        >
          <span className="break-words">{tag}</span>
          {onRemove && (
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => onRemove(tag)}
              className="grid size-6 shrink-0 place-items-center rounded-full hover:bg-black/10"
            >
              <X aria-hidden className="size-3" />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
export function ActionBar({
  children,
  summary,
  className,
}: {
  children: ReactNode;
  summary: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4",
        className,
      )}
    >
      <p role="status" className="text-sm font-medium">
        {summary}
      </p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
export function Stack({
  direction = "vertical",
  gap = "md",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  direction?: "vertical" | "horizontal";
  gap?: "sm" | "md" | "lg";
}) {
  return (
    <div
      {...props}
      className={cn(
        "flex",
        direction === "vertical" ? "flex-col" : "flex-wrap items-center",
        gap === "sm" ? "gap-2" : gap === "lg" ? "gap-6" : "gap-4",
        className,
      )}
    />
  );
}
export function Grid({
  columns = 3,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { columns?: 2 | 3 | 4 }) {
  return (
    <div
      {...props}
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns === 4 && "lg:grid-cols-4",
        className,
      )}
    />
  );
}
