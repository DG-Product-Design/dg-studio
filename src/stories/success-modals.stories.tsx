import type { Meta, StoryObj } from '@storybook/react-vite';
import { SuccessModalDemo } from '../examples/marketplace-planned';
import storyExamples1 from '../examples/marketplace-planned.tsx?examples';

const meta = {
  title: 'Overlays/Success confirmations',
  component: SuccessModalDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof SuccessModalDemo>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.SuccessModalDemo,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};
