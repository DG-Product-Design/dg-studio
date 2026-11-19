import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricsDemo } from '../examples/marketplace-planned';
import storyExamples1 from '../examples/marketplace-planned.tsx?examples';

const meta = {
  title: 'Content/Metrics graph',
  component: MetricsDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof MetricsDemo>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.MetricsDemo,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};
