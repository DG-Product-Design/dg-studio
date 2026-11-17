import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Logo, CountBadge } from "./foundation-primitives";
import { DetailsPanel } from "./overlays";
import { Popover } from "./navigation";
import { Picture } from "./marketplace-content";
import { ImageFade, type ImageFadeProps } from "./image-fade";
import { SlideshowDots } from "./media";
import { cn } from "../lib/utils";
export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  onSelect?: () => void;
  disabled?: boolean;
  children?: NavigationItem[];
}
function NavigationLink({
  item,
  active,
}: {
  item: NavigationItem;
  active?: string;
}) {
  const className = cn(
    "block w-full rounded-lg px-3 py-2 text-left text-sm",
    active === item.id
      ? "bg-primary text-primary-foreground"
      : "hover:bg-accent",
    item.disabled && "opacity-50",
  );
  return item.href && !item.disabled ? (
    <a
      href={item.href}
      aria-current={active === item.id ? "page" : undefined}
      className={className}
    >
      {item.label}
    </a>
  ) : (
    <button
      type="button"
      disabled={item.disabled}
      aria-current={active === item.id ? "page" : undefined}
      className={className}
      onClick={item.onSelect}
    >
      {item.label}
    </button>
  );
}
export function SidebarMenu({
  items,
  active,
  label = "Workspace",
}: {
  items: NavigationItem[];
  active?: string;
  label?: string;
}) {
  return (
    <nav aria-label={label}>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            {item.children?.length ? (
              <details
                open={
                  item.children.some((child) => child.id === active) ||
                  undefined
                }
              >
                <summary className="cursor-pointer rounded px-3 py-2 text-sm font-semibold">
                  {item.label}
                </summary>
                <div className="ml-4 border-l pl-2">
                  <SidebarMenu
                    items={item.children}
                    active={active}
                    label={item.label}
                  />
                </div>
              </details>
            ) : (
              <NavigationLink item={item} active={active} />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
export interface GiftItem {
  id: string;
  name: string;
  vendor: string;
  seen: boolean;
  expires?: string;
  image?: string;
}
export function GiftsMenu({
  gifts,
  onSelect,
}: {
  gifts: GiftItem[];
  onSelect: (id: string) => void;
}) {
  return (
    <ul aria-label="Gifts" className="max-h-80 space-y-3 overflow-y-auto">
      {gifts.length ? (
        gifts.map((gift) => (
          <li key={gift.id}>
            <button
              type="button"
              onClick={() => onSelect(gift.id)}
              className="flex w-full items-center gap-3 rounded-lg border p-3 text-left"
            >
              {gift.image && (
                <img
                  src={gift.image}
                  alt=""
                  className="size-10 rounded object-cover"
                />
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">
                  {gift.seen ? gift.name : "You have a new gift!"}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {gift.vendor}
                </span>
                {gift.expires && (
                  <span className="block text-xs">Expires {gift.expires}</span>
                )}
              </span>
              <span className="text-xs text-primary">
                {gift.seen ? "Redeem" : "View"}
              </span>
            </button>
          </li>
        ))
      ) : (
        <li className="text-sm text-muted-foreground">No gifts yet.</li>
      )}
    </ul>
  );
}
export function MainNavigation({
  items,
  active,
  gifts = [],
  onGiftSelect,
}: {
  items: NavigationItem[];
  active?: string;
  gifts?: GiftItem[];
  onGiftSelect?: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <nav aria-label="Main navigation">
        <ul className="flex flex-wrap gap-1">
          {items.map((item) => (
            <li key={item.id}>
              <NavigationLink item={item} active={active} />
            </li>
          ))}
        </ul>
      </nav>
      {onGiftSelect && (
        <Popover
          title="Your gifts"
          trigger={
            <Button type="button" variant="outline">
              Gifts <CountBadge count={gifts.filter((g) => !g.seen).length} />
            </Button>
          }
        >
          <GiftsMenu gifts={gifts} onSelect={onGiftSelect} />
        </Popover>
      )}
    </div>
  );
}
export function MainFooter({
  links = [],
  secondary = [],
  children,
}: {
  links?: { label: string; href: string }[];
  secondary?: { label: string; href: string }[];
  children?: ReactNode;
}) {
  return (
    <footer className="space-y-4 border-t py-6 text-sm text-muted-foreground">
      <nav aria-label="Footer">
        <ul className="flex flex-wrap gap-5">
          {[...links, ...secondary].map((link) => (
            <li key={link.href}>
              <a
                className="rounded underline underline-offset-4"
                href={link.href}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {children}
    </footer>
  );
}
export function AppFrame({
  navigation,
  sidebar,
  children,
  footer,
  brand,
}: {
  navigation: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  brand?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b p-4">
        {brand ?? <Logo />}
        {navigation}
        {sidebar && (
          <Button
            className="lg:hidden"
            variant="outline"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu aria-hidden />
          </Button>
        )}
      </header>
      <div className="flex">
        {sidebar && (
          <aside className="hidden w-56 shrink-0 border-r p-4 lg:block">
            {sidebar}
          </aside>
        )}
        <main className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
      </div>
      {footer && <div className="px-5">{footer}</div>}
      {sidebar && (
        <DetailsPanel
          open={open}
          onOpenChange={setOpen}
          title="Navigation"
          description="Choose a workspace view."
        >
          <div
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("button,a")) setOpen(false);
            }}
          >
            {sidebar}
          </div>
        </DetailsPanel>
      )}
    </div>
  );
}
export function SplitScreen({
  image,
  children,
  footer,
}: {
  image: { src: string; alt: string };
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid overflow-hidden rounded-xl border lg:grid-cols-2">
      <div className="min-w-0 bg-muted">
        <ImageFade
          src={image.src}
          alt={image.alt}
          width={4}
          height={3}
          className="h-full min-h-48 w-full rounded-none"
        />
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-8 p-6 sm:p-10">
        {children}
        {footer}
      </div>
    </div>
  );
}
export interface HeroItem {
  id: string;
  title: string;
  summary: string;
  image: Pick<ImageFadeProps, "src" | "alt" | "blurBg" | "aspectRatio"> &
    Partial<Pick<ImageFadeProps, "width" | "height">>;
}
export function HeroDetail({
  title,
  summary,
  onViewDetails,
  disabled = false,
}: {
  title: string;
  summary: string;
  onViewDetails?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-semibold">{title}</h2>
      <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
        {summary}
      </p>
      {onViewDetails && (
        <Button type="button" disabled={disabled} onClick={onViewDetails}>
          View details
        </Button>
      )}
    </div>
  );
}
export function HeroPanel({
  item,
  onViewDetails,
}: {
  item: HeroItem;
  onViewDetails?: (item: HeroItem) => void;
}) {
  return (
    <section
      aria-label={item.title}
      className="grid items-center gap-6 overflow-hidden rounded-xl border bg-card sm:grid-cols-2"
    >
      <Picture
        src={item.image.src}
        alt={item.image.alt}
        width={item.image.width ?? 4}
        height={item.image.height ?? 3}
        aspectRatio={item.image.aspectRatio ?? "4 / 3"}
        blurBg={item.image.blurBg}
        className="h-full rounded-none"
      />
      <div className="p-6 sm:py-8">
        <HeroDetail
          title={item.title}
          summary={item.summary}
          onViewDetails={onViewDetails ? () => onViewDetails(item) : undefined}
        />
      </div>
    </section>
  );
}
export function Hero({
  items,
  onViewDetails,
  interval = 0,
}: {
  items: HeroItem[];
  onViewDetails?: (item: HeroItem) => void;
  interval?: number;
}) {
  const [index, setIndex] = useState(0),
    [paused, setPaused] = useState(false);
  const current = Math.min(index, items.length - 1);
  useEffect(() => {
    if (interval <= 0 || paused || items.length < 2) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (!reduced.matches)
        timer = setInterval(
          () => setIndex((i) => (i + 1) % items.length),
          Math.max(interval, 3000),
        );
    };
    sync();
    reduced.addEventListener("change", sync);
    return () => {
      clearInterval(timer);
      reduced.removeEventListener("change", sync);
    };
  }, [interval, paused, items.length]);
  if (!items.length) return <p>No featured items.</p>;
  return (
    <div
      className="space-y-3"
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
    >
      <HeroPanel item={items[current]} onViewDetails={onViewDetails} />
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous feature"
          disabled={items.length < 2}
          onClick={() => {
            setPaused(true);
            setIndex((current - 1 + items.length) % items.length);
          }}
        >
          <ChevronLeft aria-hidden />
        </Button>
        <SlideshowDots
          count={items.length}
          current={current}
          onChange={(i) => {
            setPaused(true);
            setIndex(i);
          }}
        />
        <Button
          variant="outline"
          size="icon"
          aria-label="Next feature"
          disabled={items.length < 2}
          onClick={() => {
            setPaused(true);
            setIndex((current + 1) % items.length);
          }}
        >
          <ChevronRight aria-hidden />
        </Button>
        {interval > 0 && (
          <Button variant="ghost" onClick={() => setPaused(!paused)}>
            {paused ? "Play slideshow" : "Pause slideshow"}
          </Button>
        )}
      </div>
    </div>
  );
}
