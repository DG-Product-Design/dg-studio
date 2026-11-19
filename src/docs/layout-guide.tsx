import { useEffect, useState } from 'react';

export function TypographyGuide() {
  return (
    <main className="mx-auto max-w-4xl space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Typography</h1>
        <p className="mt-3 text-muted-foreground">
          Avenir Next for the interface. System monospace for tokens and code. Semantic HTML stays
          independent of visual size.
        </p>
      </header>
      {[
        {
          name: 'Display',
          className: 'text-5xl font-semibold tracking-tight',
          text: 'A new perspective.',
        },
        {
          name: 'Page title',
          className: 'text-3xl font-semibold',
          text: 'Your creative library',
        },
        {
          name: 'Section title',
          className: 'text-xl font-semibold',
          text: 'Made for the next idea',
        },
        {
          name: 'Body',
          className: 'text-base leading-relaxed',
          text: 'Collect references, shape a direction, and make room for something unexpected.',
        },
        {
          name: 'Supporting',
          className: 'text-sm text-muted-foreground',
          text: 'The original image stays in your library.',
        },
        {
          name: 'Caption',
          className: 'text-xs text-muted-foreground',
          text: 'WebP · 540 × 960 pixels',
        },
      ].map((item) => (
        <section key={item.name} className="border-b pb-7">
          <h2 className="mb-3 text-sm font-medium text-primary">{item.name}</h2>
          <p className={item.className}>{item.text}</p>
          <code className="mt-3 block text-xs text-muted-foreground">{item.className}</code>
        </section>
      ))}
    </main>
  );
}

export function LayoutGuide() {
  const [width, setWidth] = useState<number>();
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);

    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <main className="mx-auto max-w-5xl space-y-9">
      <header>
        <h1 className="text-3xl font-semibold">Spacing & breakpoints</h1>
        <p className="mt-3 text-muted-foreground">
          A four-pixel rhythm and the current Tailwind breakpoints. Resize the story to see which
          rules apply.
        </p>
      </header>
      <p role="status" className="text-lg">
        Viewport: {width ?? '—'} px
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ['sm', 640],
          ['md', 768],
          ['lg', 1024],
          ['xl', 1280],
          ['2xl', 1536],
        ].map(([name, size]) => (
          <div key={name} className="rounded-lg border bg-card p-4">
            <h2 className="font-semibold">
              {name}: {size} px
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {width !== undefined && width >= Number(size) ? 'Active' : 'Not active yet'}
            </p>
          </div>
        ))}
      </div>
      <section>
        <h2 className="mb-5 text-xl font-semibold">Spacing scale</h2>
        <div className="space-y-3">
          {[4, 8, 12, 16, 24, 32, 48].map((size) => (
            <div key={size} className="flex items-center gap-4">
              <code className="w-24 text-xs">
                {size}px / {size / 4}
              </code>
              <div className="h-5 rounded bg-primary" style={{ width: size }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function ElevationGuide() {
  return (
    <main className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold">Elevation</h1>
      <p className="mt-3 mb-10 text-muted-foreground">
        Use borders for grouping. Add a shadow when a surface floats above another.
      </p>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Resting surface', 'shadow-none', 'Cards in a collection'],
          ['Raised control', 'shadow-sm', 'Small interactive controls'],
          ['Floating surface', 'shadow-lg', 'Menus and popovers'],
          ['Overlay', 'shadow-2xl', 'Modals and details panels'],
        ].map(([label, shadow, use]) => (
          <section key={label} className={`rounded-xl border bg-card p-6 ${shadow}`}>
            <h2 className="font-semibold">{label}</h2>
            <p className="mt-3 min-h-12 text-sm text-muted-foreground">{use}</p>
            <code className="text-xs text-primary">{shadow}</code>
          </section>
        ))}
      </div>
    </main>
  );
}
