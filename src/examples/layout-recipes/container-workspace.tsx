import { useState } from "react";
import { ImageFade } from "../../components/image-fade";
import { Button } from "../../components/ui/button";
import { assets } from "../assets";
function AdaptiveAsset({
  asset,
  onChoose,
}: {
  asset: (typeof assets)[number];
  onChoose: () => void;
}) {
  return (
    <div className="dg-query-card">
      <article className="dg-query-card-layout">
        <ImageFade
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          blurBg
          aspectRatio="4 / 3"
          className="dg-query-art"
        />
        <div className="dg-query-copy">
          <p className="text-xs text-muted-foreground">{asset.collection}</p>
          <h3>{asset.title}</h3>
          <p>{asset.alt}</p>
          <div className="dg-query-tags">
            {asset.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <Button variant="secondary" onClick={onChoose}>
            Select artwork
          </Button>
        </div>
        <dl className="dg-query-metadata">
          <div>
            <dt>Dimensions</dt>
            <dd>
              {asset.width} × {asset.height}
            </dd>
          </div>
          <div>
            <dt>Usage</dt>
            <dd>Campaign ready</dd>
          </div>
          <div>
            <dt>Owner</dt>
            <dd>D.G Studio</dd>
          </div>
        </dl>
      </article>
    </div>
  );
}
export function ContainerWorkspace() {
  const [width, setWidth] = useState(100),
    [compact, setCompact] = useState(false),
    [selected, setSelected] = useState(assets[2]);
  return (
    <main className="mx-auto max-w-6xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">One card, any container</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Resize the workspace. Each card responds to its own container,
          including the narrow inspector, using named queries and fluid type.
        </p>
      </header>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-3 text-sm">
          Workspace width{" "}
          <input
            aria-label="Workspace width"
            type="range"
            min="25"
            max="100"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
          <output>{width}%</output>
        </label>
        <Button variant="outline" onClick={() => setWidth(25)}>
          Narrow
        </Button>
        <Button variant="outline" onClick={() => setWidth(100)}>
          Wide
        </Button>
        <Button
          variant="outline"
          aria-pressed={compact}
          onClick={() => setCompact((v) => !v)}
        >
          Compact density
        </Button>
      </div>
      <div
        className="dg-query-workspace"
        style={{ width: `${width}%`, minWidth: "min(100%, 18rem)" }}
        data-density={compact ? "compact" : "comfortable"}
      >
        <div className="dg-query-workspace-layout">
          <section
            className="min-w-0 space-y-4"
            aria-label="Collection workspace"
          >
            <h2 className="font-semibold">Campaign collection</h2>
            {assets.slice(0, 3).map((asset) => (
              <AdaptiveAsset
                key={asset.id}
                asset={asset}
                onChoose={() => setSelected(asset)}
              />
            ))}
          </section>
          <aside className="min-w-0 space-y-4" aria-label="Artwork inspector">
            <h2 className="font-semibold">Inspector</h2>
            <AdaptiveAsset
              asset={selected}
              onChoose={() =>
                setSelected(
                  assets[(assets.indexOf(selected) + 1) % assets.length],
                )
              }
            />
            <p
              role="status"
              aria-label="Selected artwork"
              className="text-sm text-muted-foreground"
            >
              Selected: {selected.title}
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
