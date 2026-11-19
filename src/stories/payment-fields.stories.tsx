import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaymentFieldsDemo } from '../examples/marketplace-planned';
import storyExamples1 from '../examples/marketplace-planned.tsx?examples';

const meta = {
  title: 'Forms/Payment fields',
  component: PaymentFieldsDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof PaymentFieldsDemo>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.PaymentFieldsDemo,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};
