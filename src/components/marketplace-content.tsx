import { useId, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { ActionButton, type ActionButtonProps } from "./action-button";
import { ActionBar, Avatar } from "./content";
import { Button } from "./ui/button";
import { ImageFade, type ImageFadeProps } from "./image-fade";
import { cn } from "../lib/utils";

export function BalanceActionBar({
  points,
  pointsPerUnit = 5,
  currency = "USD",
  children,
  description,
}: {
  points: number;
  pointsPerUnit?: number;
  currency?: string;
  children: ReactNode;
  description?: string;
}) {
  return (
    <section className="space-y-4 rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-baseline gap-3">
        <p className="text-3xl font-semibold tabular-nums">
          {new Intl.NumberFormat().format(points)}{" "}
          <span className="text-sm">points</span>
        </p>
        <p className="text-muted-foreground">
          {pointsPerUnit > 0
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency,
              }).format(points / pointsPerUnit)
            : "Conversion unavailable"}
        </p>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );
}
export function AdminToolbar({
  role,
  integrated = false,
  onAddEmployee,
  onCreateProgram,
}: {
  role: "owner" | "admin" | "user";
  integrated?: boolean;
  onAddEmployee: () => void;
  onCreateProgram?: () => void;
}) {
  return (
    <ActionBar
      summary={
        integrated
          ? "Employees managed by your integration"
          : "Team administration"
      }
    >
      <Button
        type="button"
        disabled={integrated || role === "user"}
        onClick={onAddEmployee}
      >
        Add employee
      </Button>
      {role === "owner" && (
        <Button
          type="button"
          variant="outline"
          disabled={!onCreateProgram}
          onClick={onCreateProgram}
        >
          Create program
        </Button>
      )}
    </ActionBar>
  );
}
export interface VendorTag {
  id: string;
  slug: string;
  label: string;
}
export function CardTagList({
  tags,
  onSelectTag,
  selected = [],
  limit = 10,
  scroll = true,
}: {
  tags: VendorTag[];
  onSelectTag: (tag: VendorTag) => void;
  selected?: string[];
  limit?: number;
  scroll?: boolean;
}) {
  return (
    <ul
      aria-label="Filter by tag"
      className={cn(
        "flex gap-2 py-1",
        scroll ? "overflow-x-auto" : "flex-wrap",
      )}
    >
      {tags.slice(0, limit).map((tag) => (
        <li key={tag.id} className="shrink-0">
          <Button
            type="button"
            size="sm"
            variant={selected.includes(tag.slug) ? "default" : "outline"}
            aria-pressed={selected.includes(tag.slug)}
            onClick={() => onSelectTag(tag)}
          >
            {tag.label}
          </Button>
        </li>
      ))}
    </ul>
  );
}
export function CardFooter(props: Parameters<typeof CardTagList>[0]) {
  return (
    <footer className="border-t px-5 py-3">
      <CardTagList {...props} />
    </footer>
  );
}
export function BeamAvatar({
  name,
  size = 48,
}: {
  name: string;
  size?: number;
}) {
  const hash = Array.from(name).reduce(
    (n, char) => (n * 31 + char.codePointAt(0)!) >>> 0,
    7,
  );
  const id = useId();
  return (
    <svg
      role="img"
      aria-label={name}
      width={size}
      height={size}
      viewBox="0 0 80 80"
    >
      <defs>
        <clipPath id={id}>
          <circle cx="40" cy="40" r="40" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <path fill="var(--secondary)" d="M0 0h80v80H0z" />
        <g
          transform={`translate(${(hash % 13) - 6} ${(hash % 9) - 4}) rotate(${(hash % 31) - 15} 40 40)`}
        >
          <rect
            x="12"
            y="12"
            width="58"
            height="76"
            rx="28"
            fill="var(--primary)"
          />
          <g fill="var(--primary-foreground)">
            <circle cx="30" cy="37" r="3" />
            <circle cx="50" cy="37" r="3" />
          </g>
          <path
            d={hash % 2 ? "M31 49q9 10 18 0" : "M32 51h16"}
            fill="none"
            stroke="var(--primary-foreground)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}
export function PersonAvatar({
  illustrated = false,
  ...props
}: Parameters<typeof Avatar>[0] & { illustrated?: boolean }) {
  return illustrated ? (
    <BeamAvatar
      name={props.name}
      size={props.size === "lg" ? 56 : props.size === "sm" ? 32 : 40}
    />
  ) : (
    <Avatar {...props} />
  );
}
export function DropdownButton({
  expanded,
  children,
  ...props
}: ActionButtonProps & { expanded: boolean }) {
  return (
    <ActionButton
      {...props}
      aria-expanded={expanded}
      trailingIcon={
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 transition-transform",
            expanded && "rotate-180",
          )}
        />
      }
    >
      {children}
    </ActionButton>
  );
}
export function PictureFade({
  children,
  edge = "bottom",
  size = 64,
}: {
  children: ReactNode;
  edge?: "bottom" | "right" | "both";
  size?: number;
}) {
  const fade = (direction: string) =>
    `linear-gradient(${direction}, #000 calc(100% - ${size}px), transparent)`;
  return (
    <div
      style={{
        maskImage:
          edge === "both"
            ? `${fade("to right")}, ${fade("to bottom")}`
            : fade(edge === "right" ? "to right" : "to bottom"),
        maskComposite: edge === "both" ? "intersect" : undefined,
      }}
    >
      {children}
    </div>
  );
}
export function Picture({
  dissolve = false,
  ...props
}: ImageFadeProps & { dissolve?: boolean }) {
  return dissolve ? (
    <PictureFade>
      <ImageFade {...props} />
    </PictureFade>
  ) : (
    <ImageFade {...props} />
  );
}
export function ModalHeroImage({
  src,
  alt,
  title,
  children,
  action,
}: {
  src: string;
  alt: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="space-y-5 text-center">
      <ImageFade src={src} alt={alt} width={16} height={9} />
      <h3 className="text-2xl font-semibold">{title}</h3>
      <div className="text-muted-foreground">{children}</div>
      {action}
    </div>
  );
}
export function ModalIconTextGroup({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 text-center">
      <div
        aria-hidden
        className="mx-auto grid size-20 place-items-center rounded-full bg-secondary text-secondary-foreground [&>svg]:size-9"
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
