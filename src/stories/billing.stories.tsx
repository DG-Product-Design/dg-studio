import type { Meta, StoryObj } from '@storybook/react-vite';
import { BillingDemo } from '../examples/marketplace-planned';
import storyExamples1 from '../examples/marketplace-planned.tsx?examples';

const meta = {
  title: 'Examples/Profile and billing',
  component: BillingDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof BillingDemo>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.BillingDemo,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};
