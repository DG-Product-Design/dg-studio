import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { InsetProgressDemo } from '../examples/animation-studies';
import storyExamples1 from '../examples/animation-studies.tsx?examples';

const meta = {
  title: 'Navigation/Inset stepper',
  component: InsetProgressDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Recessed tracks, numbered wells, completed checkmarks, and sequential unlocking. Native buttons replace click-only elements; isolated layers keep the connector visible. Try this is a light theme for extra skeuomorphism.',
      },
    },
  },
  render: () => <InsetProgressDemo />,
} satisfies Meta<typeof InsetProgressDemo>;

export default meta;

export const Journey: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.InsetProgressDemo,
        language: 'tsx',
        type: 'code',
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    // Hold every state long enough to follow the journey in the canvas.
    const advance = async (button: HTMLElement) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await userEvent.click(button);
    };

    await expect(canvas.getByRole('button', { name: /Artwork Locked/ })).toBeDisabled();
    await advance(canvas.getByRole('button', { name: 'Complete step' }));
    await expect(canvas.getByRole('button', { name: /Artwork Available/ })).toHaveAttribute(
      'aria-current',
      'step',
    );
    await advance(canvas.getByRole('button', { name: /Details Completed/ }));
    await advance(canvas.getByRole('button', { name: 'Continue' }));
    await advance(canvas.getByRole('button', { name: 'Complete step' }));
    await advance(canvas.getByRole('button', { name: 'Complete step' }));
    await advance(canvas.getByRole('button', { name: 'Publish collection' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('4 of 4 steps complete');
    await advance(canvas.getByRole('button', { name: 'Start over' }));
    await expect(canvas.getByRole('button', { name: /Artwork Locked/ })).toBeDisabled();
  },
};
