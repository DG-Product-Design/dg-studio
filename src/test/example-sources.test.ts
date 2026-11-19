import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { extractExampleSources } from '../../.storybook/example-sources';

const directories: string[] = [];

function fixture(source: string) {
  const directory = mkdtempSync(join(tmpdir(), 'dg-examples-'));
  directories.push(directory);
  const filename = join(directory, 'examples.tsx');
  writeFileSync(filename, source);

  return filename;
}

afterEach(() =>
  directories.splice(0).forEach((directory) => rmSync(directory, { recursive: true, force: true })),
);

describe('Storybook example source', () => {
  it('includes referenced helpers, data, types and imports without unrelated demos or tests', () => {
    const filename = fixture(`
import { useState, useEffect } from 'react';
import { Button, Modal } from './ui';
type Choice = { label: string };
const choices: Choice[] = [{ label: 'First' }];
function label(choice: Choice) { return choice.label; }
export function Demo() {
  const [selected, setSelected] = useState(choices[0]);
  return <Button onClick={() => setSelected(choices[0])}>{label(selected)}</Button>;
}
export function Unrelated() { useEffect(() => {}, []); return <Modal />; }
export const Story = { render: () => <Demo />, play: async () => {} };
`);

    const source = extractExampleSources(filename).Demo;
    expect(source).toContain('function Demo');
    expect(source).toContain('function label');
    expect(source).toContain('type Choice');
    expect(source).toContain('const choices');
    expect(source).toContain('import { useState }');
    expect(source).toContain('import { Button }');
    expect(source).not.toMatch(/Unrelated|useEffect|Modal|play:/);
  });

  it('resolves bindings rather than unrelated declarations with the same identifier', () => {
    const filename = fixture(`
function unused() { return 'unrelated'; }
export const Demo = () => { const unused = 'local'; return <p>{unused}</p>; };
`);

    expect(extractExampleSources(filename).Demo).not.toContain('function unused');
  });

  it('reads updated source on the next load', () => {
    const filename = fixture('export function Demo() { return <p>Before</p>; }');
    expect(extractExampleSources(filename).Demo).toContain('Before');
    writeFileSync(filename, 'export function Demo() { return <p>After</p>; }');
    expect(extractExampleSources(filename).Demo).toContain('After');
  });
});

it('resolves every source snippet selected by the stories', () => {
  const root = resolve('src/stories');
  const catalogs = new Map<string, Record<string, string>>();
  let checked = 0;

  for (const entry of readdirSync(root, { recursive: true })) {
    if (typeof entry !== 'string' || !entry.endsWith('.stories.tsx')) continue;
    const filename = join(root, entry);
    const source = readFileSync(filename, 'utf8');

    for (const match of source.matchAll(/import\s+(\w+)\s+from\s+['"]([^'"]+)\?examples['"]/g)) {
      const [, binding, modulePath] = match;
      const demoFile = resolve(dirname(filename), modulePath);
      if (!catalogs.has(demoFile)) catalogs.set(demoFile, extractExampleSources(demoFile));
      const catalog = catalogs.get(demoFile)!;

      for (const reference of source.matchAll(new RegExp(`\\b${binding}\\.(\\w+)`, 'g'))) {
        expect(catalog[reference[1]], `${entry}: ${reference[1]}`).toEqual(expect.any(String));
        expect(catalog[reference[1]].length).toBeGreaterThan(80);
        checked += 1;
      }
    }
  }

  expect(checked).toBeGreaterThan(0);
});
