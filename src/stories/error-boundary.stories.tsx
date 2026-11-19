import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorBoundaryDemo } from '../examples/marketplace-planned';
import storyExamples1 from '../examples/marketplace-planned.tsx?examples';

const meta = {
  title: 'Feedback/Error boundary',
  component: ErrorBoundaryDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorBoundaryDemo>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.ErrorBoundaryDemo,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};
