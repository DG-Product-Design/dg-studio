import type { Meta, StoryObj } from '@storybook/react-vite';
import { CollectionTable } from '../examples/collection-table';
import storyExamples1 from '../examples/collection-table.tsx?examples';

const meta = {
  title: 'Examples/Collection manager',
  component: CollectionTable,
  tags: ['autodocs'],
} satisfies Meta<typeof CollectionTable>;

export default meta;

export const Default: StoryObj<typeof CollectionTable> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.CollectionTable,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};
