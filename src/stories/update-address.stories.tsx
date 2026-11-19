import type { Meta, StoryObj } from '@storybook/react-vite';
import { UpdateAddressDemo } from '../examples/marketplace-planned';
import storyExamples1 from '../examples/marketplace-planned.tsx?examples';

const meta = {
  title: 'Forms/Update address',
  component: UpdateAddressDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof UpdateAddressDemo>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.UpdateAddressDemo,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};
