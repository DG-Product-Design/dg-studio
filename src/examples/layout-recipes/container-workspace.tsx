import './container-workspace.css';
import { useState } from 'react';
import { ImageFade } from '../../components/image-fade';
import { Button } from '../../components/ui/button';
import { assets } from '../assets';

function AdaptiveAsset({
  asset,
  onChoose,
}: {
  asset: (typeof assets)[number];
  onChoose: () => void;
}) {
  return (
    <div className="@container/asset-card min-w-0">
      <article
        data-asset-layout
        className="grid overflow-hidden rounded-lg border bg-card @[24rem]/asset-card:grid-cols-[35%_minmax(0,1fr)] @[42rem]/asset-card:grid-cols-[30%_minmax(0,1fr)_9rem]"
      >
        <ImageFade
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          blurBg
          aspectRatio="4 / 3"
          className="rounded-none @[24rem]/asset-card:h-full @[24rem]/asset-card:w-full @[24rem]/asset-card:min-h-52"
        />
        <div
          data-asset-copy
          className="flex flex-col items-start gap-[var(--dg-query-copy-gap,0.75rem)] p-(--dg-query-pad)"
        >
          <p className="text-xs text-muted-foreground">{asset.collection}</p>
          <h3 className="text-[clamp(1.1rem,3.4cqi,1.75rem)] leading-[1.2] font-[650]">
            {asset.title}
          </h3>
          <p className="text-sm text-muted-foreground">{asset.alt}</p>
          <div className="hidden flex-wrap gap-2 @[24rem]/asset-card:flex">
            {asset.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>
          <Button variant="secondary" onClick={onChoose}>
            Select artwork
          </Button>
        </div>
        <dl className="hidden gap-3 p-(--dg-query-pad) text-xs @[42rem]/asset-card:grid @[42rem]/asset-card:content-center @[42rem]/asset-card:border-l [&_dt]:text-muted-foreground">
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
  const [width, setWidth] = useState(100);
  const [compact, setCompact] = useState(false);
  const [selected, setSelected] = useState(assets[2]);

  return (
    <main className="mx-auto max-w-6xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">One card, any container</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Resize the workspace. Each card responds to its own container, including the narrow
          inspector, using named queries and fluid type.
        </p>
      </header>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-3 text-sm">
          Workspace width{' '}
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
        <Button variant="outline" aria-pressed={compact} onClick={() => setCompact((v) => !v)}>
          Compact density
        </Button>
      </div>
      <div
        className="@container/workspace [--dg-query-pad:1.25rem] data-[density=compact]:[--dg-query-pad:0.75rem]"
        style={{ width: `${width}%`, minWidth: 'min(100%, 18rem)' }}
        data-density={compact ? 'compact' : 'comfortable'}
      >
        <div className="grid gap-6 @[64rem]/workspace:grid-cols-[minmax(0,1fr)_18rem]">
          <section className="min-w-0 space-y-4" aria-label="Collection workspace">
            <h2 className="font-semibold">Campaign collection</h2>
            {assets.slice(0, 3).map((asset) => (
              <AdaptiveAsset key={asset.id} asset={asset} onChoose={() => setSelected(asset)} />
            ))}
          </section>
          <aside className="min-w-0 space-y-4" aria-label="Artwork inspector">
            <h2 className="font-semibold">Inspector</h2>
            <AdaptiveAsset
              asset={selected}
              onChoose={() => setSelected(assets[(assets.indexOf(selected) + 1) % assets.length])}
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
