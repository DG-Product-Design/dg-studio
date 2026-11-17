import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import { Button } from "../../components/ui/button";
import { SelectField } from "../../components/fields";
import { assets } from "../assets";
import { cn } from "../../lib/utils";
type Asset = (typeof assets)[number];
export function TransitionGallery({
  forceFallback = false,
}: {
  forceFallback?: boolean;
}) {
  const [selected, setSelected] = useState<Asset | null>(null),
    [layout, setLayout] = useState<"grid" | "list">("grid"),
    [reverse, setReverse] = useState(false),
    [collection, setCollection] = useState("All"),
    [busy, setBusy] = useState(false);
  const active = useRef<ViewTransition | null>(null),
    locked = useRef(false),
    mounted = useRef(true);
  const heading = useRef<HTMLHeadingElement>(null),
    buttons = useRef(new Map<string, HTMLButtonElement>());
  const prefix = `gallery-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      active.current?.skipTransition();
    };
  }, []);
  function change(update: () => void, focus?: () => void) {
    if (locked.current) return;
    const previousFocus = document.activeElement;
    const restoreFocus =
      focus ??
      (() => {
        if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
          previousFocus.focus({ preventScroll: true });
      });
    const commit = () => {
      flushSync(update);
    };
    if (
      forceFallback ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      commit();
      restoreFocus();
      return;
    }
    locked.current = true;
    setBusy(true);
    let committed = false;
    try {
      const transition = document.startViewTransition(() => {
        if (mounted.current) {
          committed = true;
          commit();
        }
      });
      active.current = transition;
      void transition.ready.catch(() => {});
      void transition.finished
        .catch(() => {})
        .finally(() => {
          locked.current = false;
          active.current = null;
          if (mounted.current) {
            flushSync(() => setBusy(false));
            restoreFocus();
          }
        });
    } catch {
      if (!committed) commit();
      locked.current = false;
      flushSync(() => setBusy(false));
      restoreFocus();
    }
  }
  function shared(asset: Asset, kind: string): CSSProperties {
    return {
      viewTransitionName: `${prefix}-${kind}-${asset.id}`,
      viewTransitionClass: `dg-gallery-${kind}`,
    } as CSSProperties;
  }
  const filtered = assets.filter(
    (a) => collection === "All" || a.collection === collection,
  );
  const shown = reverse ? [...filtered].reverse() : filtered;
  return (
    <main
      className="dg-view-gallery mx-auto max-w-5xl space-y-6"
      aria-busy={busy}
    >
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Artwork in motion</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Change the layout, reorder the collection, or open an artwork. Images
          and titles keep their identity as they move into a new view.
        </p>
      </header>
      {selected ? (
        <section className="dg-gallery-detail">
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => {
              const id = selected.id;
              change(
                () => setSelected(null),
                () => buttons.current.get(id)?.focus({ preventScroll: true }),
              );
            }}
          >
            Back to collection
          </Button>
          <div className="dg-gallery-detail-layout">
            <img
              src={selected.src}
              alt={selected.alt}
              width={selected.width}
              height={selected.height}
              style={shared(selected, "image")}
            />
            <div className="space-y-5">
              <h2
                ref={heading}
                tabIndex={-1}
                className="text-3xl font-semibold"
                style={shared(selected, "title")}
              >
                {selected.title}
              </h2>
              <p className="text-muted-foreground">{selected.alt}</p>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Collection</dt>
                  <dd>{selected.collection}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Original dimensions</dt>
                  <dd>
                    {selected.width} × {selected.height}
                  </dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-2">
                {selected.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-3 py-1 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div
              aria-label="Gallery layout"
              role="group"
              className="flex gap-2"
            >
              {(["grid", "list"] as const).map((mode) => (
                <Button
                  key={mode}
                  disabled={busy}
                  variant={mode === layout ? "secondary" : "outline"}
                  aria-pressed={mode === layout}
                  onClick={() => change(() => setLayout(mode))}
                >
                  {mode === "grid" ? "Grid" : "List"}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => change(() => setReverse((v) => !v))}
            >
              Reverse order
            </Button>
            <SelectField
              id={`${prefix}-collection`}
              label="Collection"
              className="ml-auto w-48"
              value={collection}
              disabled={busy}
              onValueChange={(value) =>
                change(
                  () => setCollection(value),
                  () =>
                    document
                      .getElementById(`${prefix}-collection`)
                      ?.focus({ preventScroll: true }),
                )
              }
              options={[
                "All",
                ...new Set(assets.map((asset) => asset.collection)),
              ].map((value) => ({ value, label: value }))}
            />
          </div>
          <div
            className={cn(
              "dg-gallery-items",
              layout === "list" && "dg-gallery-list",
            )}
          >
            {shown.map((asset) => (
              <button
                key={asset.id}
                ref={(node) => {
                  if (node) buttons.current.set(asset.id, node);
                  else buttons.current.delete(asset.id);
                }}
                disabled={busy}
                type="button"
                className="dg-gallery-item"
                onClick={() =>
                  change(
                    () => setSelected(asset),
                    () => heading.current?.focus({ preventScroll: true }),
                  )
                }
              >
                <img
                  src={asset.src}
                  alt=""
                  width={asset.width}
                  height={asset.height}
                  style={shared(asset, "image")}
                />
                <span className="dg-gallery-caption">
                  <span className="sr-only">Open </span>
                  <span
                    className="font-semibold"
                    style={shared(asset, "title")}
                  >
                    {asset.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {asset.collection}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {shown.length} artworks
          </p>
        </>
      )}
    </main>
  );
}
