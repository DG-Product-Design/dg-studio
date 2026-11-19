import { expect, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NestedMenuDemo } from '../examples/marketplace-partials';
import storyExamples1 from '../examples/marketplace-partials.tsx?examples';

const meta = {
  title: 'Navigation/Nested menu',
  component: NestedMenuDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof NestedMenuDemo>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.NestedMenuDemo,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};

export const KeyboardSubmenu: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.NestedMenuDemo,
        language: 'tsx',
        type: 'code',
      },
    },
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Collection actions' });
    await userEvent.click(trigger);
    await userEvent.keyboard('{Home}{ArrowDown}{ArrowRight}');
    const png = await body.findByRole('menuitem', { name: 'PNG' });
    await userEvent.keyboard('{Home}');
    await expect(png).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByText('PNG export selected')).toBeVisible();
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
