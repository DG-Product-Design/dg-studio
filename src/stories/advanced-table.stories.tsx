import { expect, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdvancedTableDemo } from '../examples/marketplace-partials';
import storyExamples1 from '../examples/marketplace-partials.tsx?examples';

const meta = {
  title: 'Examples/Asset operations',
  component: AdvancedTableDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof AdvancedTableDemo>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.AdvancedTableDemo,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};

export const EditPageAndExpand: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.AdvancedTableDemo,
        language: 'tsx',
        type: 'code',
      },
    },
  },
  play: async ({ canvas, userEvent, step }) => {
    await step('Edit a row and save through the adapter', async () => {
      await userEvent.click(
        await canvas.findByRole('button', {
          name: 'Edit asset name: Dusk study 1',
        }),
      );
      const name = canvas.getByRole('textbox', {
        name: 'asset name',
      });

      await userEvent.clear(name);
      await userEvent.type(name, 'Renamed campaign{Enter}');
      await expect(
        await canvas.findByRole('button', {
          name: 'Edit asset name: Renamed campaign',
        }),
      ).toBeVisible();
    });
    await step('Page, select, and expand remote rows', async () => {
      const table = canvas.getByRole('table', { name: 'Asset operations' });
      const before = table.getBoundingClientRect();
      await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
      const during = table.getBoundingClientRect();
      await expect(during.top).toBe(before.top);
      await expect(during.bottom).toBe(before.bottom);
      await expect(table).toHaveAttribute('aria-busy', 'true');
      await expect(table.querySelectorAll('[data-loading-cell]').length).toBeGreaterThan(0);
      await expect(
        canvas.queryByRole('button', {
          name: 'Edit asset name: Renamed campaign',
        }),
      ).toBeNull();
      await canvas.findByRole('button', {
        name: 'Edit asset name: Dusk study 5',
      });
      const after = table.getBoundingClientRect();
      await expect(after.top).toBe(before.top);
      await expect(after.bottom).toBe(before.bottom);
      await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all visible rows' }));
      await expect(canvas.getByRole('checkbox', { name: 'Select Dusk study 5' })).toBeChecked();
      const toggle = canvas.getByRole('button', {
        name: 'Show details for Dusk study 5',
      });

      const row = toggle.closest('tr')!;
      await expect(row.lastElementChild).toBe(toggle.closest('td'));
      await expect(toggle).toHaveTextContent('');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(toggle);
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(await canvas.findByText(/Asset 5 ·/)).toBeVisible();
      const icon = toggle.querySelector('svg')!;
      await waitFor(() => expect(getComputedStyle(icon).rotate).toBe('180deg'));
      toggle.focus();
      await userEvent.keyboard('{Enter}');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(canvas.queryByText(/Asset 5 ·/)).toBeNull();
    });
  },
};
