import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../components/theme';
import { ClickToCopy } from '../components/feedback';

const tokens = [
  ['background', 'Canvas behind all content'],
  ['foreground', 'Primary text'],
  ['card', 'Grouped content surface'],
  ['primary', 'Main action or selected state'],
  ['secondary', 'Supporting actions and tags'],
  ['muted', 'Quiet surfaces and loading placeholders'],
  ['muted-foreground', 'Supporting text'],
  ['border', 'Edges between regions'],
  ['ring', 'Keyboard focus'],
  ['success', 'Successful actions'],
  ['warning', 'Actions that need attention'],
  ['destructive', 'Errors and destructive actions'],
] as const;

function Token({ name, usage }: { name: string; usage: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const [value, setValue] = useState('');
  useEffect(() => {
    if (ref.current) setValue(getComputedStyle(ref.current).getPropertyValue(`--${name}`).trim());
  }, [name, theme]);

  return (
    <article ref={ref} className="overflow-hidden rounded-xl border bg-card">
      <div aria-hidden className="h-24 border-b" style={{ background: `var(--${name})` }} />
      <div className="p-4">
        <div className="flex flex-wrap justify-between gap-2">
          <h2 className="font-semibold">{name}</h2>
          <code className="text-xs text-muted-foreground">{value}</code>
        </div>
        <p className="mt-2 mb-4 min-h-10 text-sm text-muted-foreground">{usage}</p>
        <ClickToCopy value={`var(--${name})`} label={`Copy ${name} token`} />
      </div>
    </article>
  );
}

export function TokenGuide() {
  return (
    <main className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-semibold">Color tokens</h1>
      <p className="mt-3 mb-8 max-w-2xl text-muted-foreground">
        Choose a theme in the toolbar. These values come from the active stylesheet, so this guide
        stays aligned with the components.
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tokens.map(([name, usage]) => (
          <Token key={name} name={name} usage={usage} />
        ))}
      </div>
    </main>
  );
}
