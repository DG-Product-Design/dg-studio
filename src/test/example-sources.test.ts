import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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

afterEach(() => directories.splice(0).forEach((directory) => rmSync(directory, { recursive: true, force: true })));

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
