import type { Meta, StoryObj } from '@storybook/react-vite';
import { SecureFieldHostDemo } from '../examples/marketplace-planned';
import storyExamples1 from '../examples/marketplace-planned.tsx?examples';

const meta = {
  title: 'Forms/Secure field host',
  component: SecureFieldHostDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof SecureFieldHostDemo>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.SecureFieldHostDemo,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};
