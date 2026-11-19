import { Controls, Primary, Stories, Subtitle, Title } from '@storybook/addon-docs/blocks';
import { expect, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlowGroup, GlowBorder } from '../components/glow-border';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import storyExamples1 from './glow-border.stories.tsx?examples';

function GlowBorderDocsDescription() {
  return (
    <div>
      <p>
        A subtle glowing border that follows the mouse and shares glow with its neighbor. The glow
        starts hidden and fades in and out over one second. On mobile, the glow slowly orbits each
        element.
      </p>
      <p>Features:</p>
      <ul>
        <li>Pointer proximity and angle</li>
        <li>Masked conic border</li>
        <li>Blurred halo</li>
        <li>Slow touch-device orbit</li>
        <li>Static reduced-motion border</li>
        <li>Two sibling borders share glow</li>
      </ul>
    </div>
  );
}

function GlowBorderDocsPage() {
  return (
    <>
      <Title />
      <Subtitle />
      <GlowBorderDocsDescription />
      <Primary />
      <Controls />
      <Stories />
    </>
  );
}

function Sample() {
  const [selected, setSelected] = useState('');

  return (
    <GlowGroup className="grid max-w-3xl gap-5 sm:grid-cols-2">
      <GlowBorder>
        <div className="space-y-4 p-6">
          <h2 className="text-xl font-semibold">Follow the edge</h2>
          <p className="text-sm text-muted-foreground">
            Move the pointer near this card, or focus the button.
          </p>
          <Button onClick={() => setSelected('First card selected')}>Choose first</Button>
        </div>
      </GlowBorder>
      <GlowBorder>
        <div className="space-y-4 p-6">
          <h2 className="text-xl font-semibold">One shared light</h2>
          <p className="text-sm text-muted-foreground">Nearby borders respond together.</p>
          <Button variant="outline" onClick={() => setSelected('Second card selected')}>
            Choose second
          </Button>
        </div>
      </GlowBorder>
      <p role="status" className="text-sm sm:col-span-2">
        {selected}
      </p>
    </GlowGroup>
  );
}

const meta = {
  title: 'Motion/Border glow',
  component: GlowGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: GlowBorderDocsPage,
    },
  },
} satisfies Meta<typeof GlowGroup>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: { code: storyExamples1.Sample, language: 'tsx', type: 'code' },
    },
  },
  render: () => <Sample />,
};

export const PointerProximity: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: { code: storyExamples1.Sample, language: 'tsx', type: 'code' },
    },
  },
  ...Default,
  play: async ({ canvasElement, step }) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches) return;
    const group = canvasElement.querySelector<HTMLElement>('.dg-glow-group')!;
    const borders = [...group.querySelectorAll<HTMLElement>('[data-glow-border]')];

    const opacity = (el: HTMLElement) => Number(getComputedStyle(el, '::after').opacity);

    await step('No colored glow before proximity activation', async () => {
      for (const border of borders) {
        await expect(opacity(border)).toBe(0);
        await expect(getComputedStyle(border, '::after').transitionDuration).toBe('1s');
      }
    });
    await step('Both siblings fade in near their shared edge', async () => {
      const first = borders[0].getBoundingClientRect();
      group.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          pointerType: 'mouse',
          clientX: first.right - 8,
          clientY: first.top + first.height / 2,
        }),
      );
      await waitFor(() => {
        for (const border of borders)
          expect(border.style.getPropertyValue('--dg-glow-opacity')).toBe('1');
      });
      await waitFor(
        () => {
          for (const border of borders) expect(opacity(border)).toBe(1);
        },
        { timeout: 1800 },
      );
    });
    await step('Leaving fades out without snapping the glow angle', async () => {
      const angles = borders.map((border) => border.style.getPropertyValue('--dg-glow-angle'));

      group.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
      for (const [index, border] of borders.entries()) {
        await expect(border.style.getPropertyValue('--dg-glow-angle')).toBe(angles[index]);
        await expect(opacity(border)).toBeGreaterThan(0);
      }

      await waitFor(
        () => {
          for (const border of borders) expect(opacity(border)).toBe(0);
        },
        { timeout: 1800 },
      );
    });
  },
};

export const Disabled: StoryObj<typeof meta> = {
  render: () => (
    <GlowGroup disabled>
      <GlowBorder>
        <p className="p-6">Plain border when glow is disabled.</p>
      </GlowBorder>
    </GlowGroup>
  ),
};

export const KeyboardInteraction: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: { code: storyExamples1.Sample, language: 'tsx', type: 'code' },
    },
  },
  ...Default,
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Choose first' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('status')).toHaveTextContent('First card selected');
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Choose second' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('status')).toHaveTextContent('Second card selected');
  },
};

function MobileSample() {
  const [selected, setSelected] = useState('');

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Glow on the go</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A slow sweep of color around each card. No pointer needed.
        </p>
      </div>
      <GlowGroup mode="orbit" spread={110} className="grid gap-5">
        <GlowBorder>
          <section className="space-y-4 p-5">
            <h2 className="text-lg font-semibold">Slow orbit</h2>
            <p className="text-sm text-muted-foreground">
              The colored edge makes one full turn every 15 seconds.
            </p>
            <Button className="w-full" onClick={() => setSelected('First card selected')}>
              Choose first
            </Button>
          </section>
        </GlowBorder>
        <GlowBorder>
          <section className="space-y-4 p-5">
            <h2 className="text-lg font-semibold">Offset glow</h2>
            <p className="text-sm text-muted-foreground">
              A different starting position keeps neighboring cards in motion.
            </p>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setSelected('Second card selected')}
            >
              Choose second
            </Button>
          </section>
        </GlowBorder>
      </GlowGroup>
      <p role="status" className="min-h-5 text-sm">
        {selected}
      </p>
    </div>
  );
}

export const MobileMode: StoryObj<typeof meta> = {
  name: 'Mobile mode',
  globals: { viewport: { value: 'mobile2', isRotated: false } },
  parameters: {
    docs: {
      source: {
        code: storyExamples1.MobileSample,
        language: 'tsx',
        type: 'code',
      },
      description: {
        story:
          'Phone layout with the touch-device orbit explicitly enabled, so it also animates when viewed with a mouse. Each card completes a 15-second rotation with staggered starting positions. Reduced motion replaces the orbit with a static colored border.',
      },
    },
  },
  render: () => <MobileSample />,
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const borders = [...canvasElement.querySelectorAll<HTMLElement>('[data-glow-border]')];

    await step('Each border uses the touch orbit', async () => {
      await expect(borders).toHaveLength(2);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      for (const border of borders) {
        await expect(getComputedStyle(border).animationName).toBe(
          reduced ? 'none' : 'dg-glow-orbit',
        );
      }

      if (!reduced) {
        await expect(getComputedStyle(borders[0]).animationDuration).toBe('15s');
        await expect(getComputedStyle(borders[1]).animationDelay).toBe('-5s');
        const angle = getComputedStyle(borders[0]).getPropertyValue('--dg-glow-angle');

        await waitFor(() =>
          expect(getComputedStyle(borders[0]).getPropertyValue('--dg-glow-angle')).not.toBe(angle),
        );
      }
    });
    await step('The cards remain interactive', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Choose first' }));
      await expect(canvas.getByRole('status')).toHaveTextContent('First card selected');
      await userEvent.click(canvas.getByRole('button', { name: 'Choose second' }));
      await expect(canvas.getByRole('status')).toHaveTextContent('Second card selected');
      // Leave the orbit visible without the test's focus outline over it.
      await userEvent.click(canvas.getByRole('heading', { name: 'Glow on the go' }));
    });
  },
};
