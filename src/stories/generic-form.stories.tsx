import type { Meta, StoryObj } from '@storybook/react-vite';
import { GenericFormDemo } from '../examples/marketplace-planned';
import storyExamples1 from '../examples/marketplace-planned.tsx?examples';

const meta = {
  title: 'Forms/Form',
  component: GenericFormDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof GenericFormDemo>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.GenericFormDemo,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};
