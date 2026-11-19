import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TransitionGallery } from './transition-gallery';

function preference(reduced: boolean) {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: reduced }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  delete (document as Partial<Document>).startViewTransition;
});
describe('TransitionGallery', () => {
  it('navigates and restores focus without the transition API', async () => {
    preference(false);
    render(<TransitionGallery />);
    await userEvent.click(screen.getByRole('button', { name: 'Open Get outside Campaigns' }));
    expect(screen.getByRole('heading', { name: 'Get outside' })).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Back to collection' }));
    expect(screen.getByRole('button', { name: 'Open Get outside Campaigns' })).toHaveFocus();
  });
  it('bypasses the API for reduced motion', async () => {
    preference(true);
    const start = vi.fn();
    document.startViewTransition = start;
    render(<TransitionGallery />);
    await userEvent.click(screen.getByRole('button', { name: 'List' }));
    expect(start).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
  });
  it('still changes views when starting a transition throws', async () => {
    preference(false);
    document.startViewTransition = vi.fn(() => {
      throw new Error('Unavailable');
    });
    render(<TransitionGallery />);
    await userEvent.click(screen.getByRole('button', { name: 'List' }));
    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'false');
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
  });
  it('locks overlapping actions and restores focus after a skipped animation', async () => {
    preference(false);
    let finish!: () => void;
    const finished = new Promise<void>((resolve) => {
      finish = resolve;
    });

    const start = vi.fn((update: () => void) => {
      update();

      return {
        ready: Promise.reject(new Error('Capture skipped')),
        finished,
        updateCallbackDone: Promise.resolve(),
        skipTransition: vi.fn(),
      };
    });

    document.startViewTransition = start as unknown as Document['startViewTransition'];
    render(<TransitionGallery />);
    await userEvent.click(screen.getByRole('button', { name: 'List' }));
    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Grid' }));
    expect(start).toHaveBeenCalledTimes(1);
    await act(async () => {
      finish();
      await finished;
    });
    await waitFor(() => expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'false'));
    expect(screen.getByRole('button', { name: 'List' })).toHaveFocus();
  });
  it('skips a pending transition when unmounted', async () => {
    preference(false);
    const skip = vi.fn();
    document.startViewTransition = vi.fn(() => ({
      ready: Promise.resolve(),
      finished: new Promise(() => {}),
      updateCallbackDone: Promise.resolve(),
      skipTransition: skip,
    })) as unknown as Document['startViewTransition'];
    const { unmount } = render(<TransitionGallery />);
    await userEvent.click(screen.getByRole('button', { name: 'List' }));
    unmount();
    expect(skip).toHaveBeenCalledOnce();
  });
});
