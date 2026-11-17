import { useId, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { ImageFade, type ImageFadeProps } from "./image-fade";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { SelectField } from "./fields";
import { Modal, DetailsPanel } from "./overlays";
export interface ImageAsset {
  id: string;
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  collection: string;
  tags: string[];
}
export function ImageLightbox({
  asset,
  open,
  onOpenChange,
}: {
  asset: ImageAsset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={asset.title}
      description={`${asset.width} × ${asset.height} pixels`}
      className="max-w-5xl"
    >
      <img
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        className="mx-auto max-h-[65dvh] w-auto object-contain"
      />
    </Modal>
  );
}
export function SlideshowDots({
  count,
  current,
  onChange,
}: {
  count: number;
  current: number;
  onChange: (index: number) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Choose image"
      className="flex flex-wrap justify-center gap-1"
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to image ${i + 1}`}
          aria-current={current === i ? "true" : undefined}
          onClick={() => onChange(i)}
          className="grid size-8 place-items-center rounded-full"
        >
          <span
            className={
              current === i
                ? "size-2.5 rounded-full bg-primary"
                : "size-2 rounded-full bg-muted-foreground"
            }
          />
        </button>
      ))}
    </div>
  );
}
export function ImageCarousel({
  images,
  loop = false,
  dots = true,
  blurBg = false,
  aspectRatio,
}: {
  images: ImageAsset[];
  loop?: boolean;
  dots?: boolean;
} & Pick<ImageFadeProps, "blurBg" | "aspectRatio">) {
  const [index, setIndex] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const current = Math.max(0, Math.min(index, images.length - 1));
  const asset = images[current];
  function move(delta: number) {
    setIndex(
      loop
        ? (current + delta + images.length) % images.length
        : Math.max(0, Math.min(current + delta, images.length - 1)),
    );
  }
  if (!asset)
    return (
      <EmptyState
        title="No images yet"
        description="Add images to start a collection."
      />
    );
  return (
    <section
      aria-label="Image carousel"
      aria-roledescription="carousel"
      className="max-w-xl"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          move(-1);
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          move(1);
        }
      }}
    >
      <div
        className="touch-pan-y"
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          start.current = { x: e.clientX, y: e.clientY };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerCancel={() => {
          start.current = null;
        }}
        onPointerUp={(e) => {
          if (!start.current) return;
          const dx = e.clientX - start.current.x,
            dy = e.clientY - start.current.y;
          start.current = null;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy))
            move(dx < 0 ? 1 : -1);
        }}
      >
        <ImageFade
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          draggable={false}
          blurBg={blurBg}
          aspectRatio={aspectRatio}
        />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Previous image"
          disabled={images.length < 2 || (!loop && current === 0)}
          onClick={() => move(-1)}
        >
          <ChevronLeft aria-hidden />
        </Button>
        <p role="status" className="text-center text-sm">
          {asset.title}
          <span className="block text-muted-foreground">
            {current + 1} of {images.length}
          </span>
        </p>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Next image"
          disabled={
            images.length < 2 || (!loop && current === images.length - 1)
          }
          onClick={() => move(1)}
        >
          <ChevronRight aria-hidden />
        </Button>
      </div>
      {dots && (
        <SlideshowDots
          count={images.length}
          current={current}
          onChange={setIndex}
        />
      )}
    </section>
  );
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-56 place-content-center gap-3 rounded-xl border border-dashed p-8 text-center">
      <Search aria-hidden className="mx-auto size-7 text-muted-foreground" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
export function PhotoLibrary({
  images,
  title = "Image library",
}: {
  images: ImageAsset[];
  title?: string;
}) {
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("All");
  const [selected, setSelected] = useState<ImageAsset>();
  const [lightbox, setLightbox] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const labelId = useId();
  const filtered = images.filter(
    (a) =>
      (collection === "All" || a.collection === collection) &&
      `${a.title} ${a.tags.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <section aria-label={title} className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 text-muted-foreground">
            Your work, ready for its next idea.
          </p>
        </div>
        <span className="text-sm text-muted-foreground" role="status">
          {filtered.length} assets
        </span>
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-48 flex-1">
          <Search
            aria-hidden
            className="absolute top-3 left-3 size-4 text-muted-foreground"
          />
          <Input
            className="pl-10"
            aria-label="Search images"
            placeholder="Search titles or tags…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <SlidersHorizontal aria-hidden className="size-4" />
        <SelectField
          label="Collection"
          hideLabel
          value={collection}
          onValueChange={setCollection}
          className="w-44"
          options={["All", ...new Set(images.map((a) => a.collection))].map(
            (value) => ({ value, label: value }),
          )}
        />
      </div>
      {filtered.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asset) => (
            <button
              key={asset.id}
              type="button"
              aria-labelledby={`${labelId}-${asset.id}-action ${labelId}-${asset.id}-title ${labelId}-${asset.id}-metadata`}
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setSelected(asset);
              }}
              className="group rounded-xl bg-card p-2 text-left"
            >
              <span id={`${labelId}-${asset.id}-action`} className="sr-only">
                View details for
              </span>
              <ImageFade
                src={asset.src}
                alt={asset.alt}
                width={4}
                height={3}
                loading="lazy"
              />
              <div className="px-2 pt-4 pb-3">
                <h3
                  id={`${labelId}-${asset.id}-title`}
                  className="font-semibold group-hover:text-primary"
                >
                  {asset.title}
                </h3>{" "}
                <p
                  id={`${labelId}-${asset.id}-metadata`}
                  className="mt-1 text-xs text-muted-foreground"
                >
                  {asset.collection} / {asset.width} × {asset.height}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState
          title={images.length ? "No matching images" : "Your library is ready"}
          description={
            images.length
              ? "Try a different title, tag, or collection."
              : "Add images to this collection to start browsing."
          }
          action={
            images.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setCollection("All");
                }}
              >
                Clear filters
              </Button>
            )
          }
        />
      )}
      {selected && (
        <>
          <DetailsPanel
            open={!lightbox}
            returnFocusRef={openerRef}
            onOpenChange={(open) => {
              if (!open) setSelected(undefined);
            }}
            title={selected.title}
            description="Asset details"
            footer={
              <Button onClick={() => setLightbox(true)}>Open full image</Button>
            }
          >
            <ImageFade
              src={selected.src}
              alt={selected.alt}
              width={selected.width}
              height={selected.height}
            />
            <dl className="my-6 grid grid-cols-2 gap-3 text-sm">
              <dt className="text-muted-foreground">Collection</dt>
              <dd>{selected.collection}</dd>
              <dt className="text-muted-foreground">Dimensions</dt>
              <dd>
                {selected.width} × {selected.height}
              </dd>
            </dl>
            <div className="flex flex-wrap gap-2">
              {selected.tags.map((tag) => (
                <Badge variant="secondary" key={tag}>
                  {tag}
                </Badge>
              ))}
            </div>
          </DetailsPanel>
          <ImageLightbox
            asset={selected}
            open={lightbox}
            onOpenChange={setLightbox}
          />
        </>
      )}
    </section>
  );
}
