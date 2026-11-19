import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchSelect } from './advanced-fields';
import type { SelectOption } from './fields';
import { deferred } from '../test/deferred';

describe('SearchSelect async requests', () => {
  it('debounces input, aborts stale requests, and ignores late results', async () => {
    vi.useFakeTimers();
    const first = deferred<SelectOption[]>();
    const second = deferred<SelectOption[]>();

    const load = vi
      .fn<(query: string, signal: AbortSignal) => Promise<SelectOption[]>>()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    render(
      <SearchSelect label="Accounts" value={null} onValueChange={vi.fn()} loadOptions={load} />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'stu' } });
    fireEvent.change(input, { target: { value: 'studio' } });
    expect(load).not.toHaveBeenCalled();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });
    expect(load).toHaveBeenCalledTimes(1);
    expect(load.mock.calls[0][0]).toBe('studio');
    fireEvent.change(input, { target: { value: 'team' } });
    expect(load.mock.calls[0][1].aborted).toBe(true);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });
    await act(async () => second.resolve([{ value: 'team', label: 'Team account' }]));
    await act(async () => first.resolve([{ value: 'studio', label: 'Stale account' }]));
    expect(screen.getByRole('option', { name: 'Team account' })).toBeVisible();
    expect(screen.queryByRole('option', { name: 'Stale account' })).not.toBeInTheDocument();
  });
  it('aborts in-flight requests when unmounted', async () => {
    vi.useFakeTimers();
    const pending = deferred<SelectOption[]>();
    const load = vi
      .fn<(query: string, signal: AbortSignal) => Promise<SelectOption[]>>()
      .mockReturnValue(pending.promise);

    const { unmount } = render(
      <SearchSelect label="Accounts" value={null} onValueChange={vi.fn()} loadOptions={load} />,
    );

    fireEvent.focus(screen.getByRole('combobox'));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });
    unmount();
    expect(load.mock.calls[0][1].aborted).toBe(true);
    await act(async () => pending.resolve([]));
  });
});
