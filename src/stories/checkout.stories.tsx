import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckoutDemo } from '../examples/marketplace-planned';
import storyExamples1 from '../examples/marketplace-planned.tsx?examples';

const meta = {
  title: 'Commerce/Checkout',
  component: CheckoutDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof CheckoutDemo>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.CheckoutDemo,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};
