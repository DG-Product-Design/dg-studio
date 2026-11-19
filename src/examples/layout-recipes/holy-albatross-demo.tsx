import './holy-albatross.css';
import { useState } from 'react';
import { ImageFade } from '../../components/image-fade';
import { Button } from '../../components/ui/button';
import { assets } from '../assets';

export function HolyAlbatrossDemo() {
  const [width, setWidth] = useState(100);
  const [selected, setSelected] = useState(assets[0]);

  return (
    <main className="mx-auto max-w-6xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Holy albatross</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A collection and its preview share the available space. Below 40rem, both panels become
          full-width without a viewport breakpoint.
        </p>
      </header>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        Available width{' '}
        <input
          aria-label="Available width"
          type="range"
          min="35"
          max="100"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
        <output>{width}%</output>
        <Button variant="outline" onClick={() => setWidth(35)}>
          Narrow
        </Button>
        <Button variant="outline" onClick={() => setWidth(100)}>
          Wide
        </Button>
      </div>
      <div
        style={{ width: `${width}%`, minWidth: 'min(100%, 18rem)' }}
        className="rounded-xl border bg-card p-4"
      >
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <h2 className="font-semibold">Studio collection</h2>
          <span className="text-xs">{assets.length} artworks</span>
        </div>
        <div className="dg-albatross">
          <section className="dg-albatross-main space-y-2" aria-label="Artworks">
            {assets.map((asset) => (
              <Button
                key={asset.id}
                variant={selected.id === asset.id ? 'secondary' : 'ghost'}
                className="h-auto w-full justify-start gap-4 py-3"
                aria-pressed={selected.id === asset.id}
                onClick={() => setSelected(asset)}
              >
                <img
                  src={asset.src}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 rounded object-cover"
                />
                <span className="text-left">
                  <span className="block">{asset.title}</span>
                  <span className="text-xs">{asset.collection}</span>
                </span>
              </Button>
            ))}
          </section>
          <aside
            className="dg-albatross-aside space-y-4 rounded-lg bg-muted/40 p-4"
            aria-label="Selected artwork"
          >
            <ImageFade
              src={selected.src}
              alt={selected.alt}
              width={selected.width}
              height={selected.height}
              blurBg
              aspectRatio="4 / 3"
            />
            <h2 className="font-semibold">{selected.title}</h2>
            <p className="text-sm text-muted-foreground">{selected.alt}</p>
            <p className="text-xs">
              {selected.width} × {selected.height} · {selected.collection}
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
