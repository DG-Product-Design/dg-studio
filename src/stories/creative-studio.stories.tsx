import type { Meta, StoryObj } from '@storybook/react-vite';
import { CreativeStudio } from '../examples/creative-studio';
import storyExamples1 from '../examples/creative-studio.tsx?examples';

const meta = {
  title: 'Examples/Creative studio',
  component: CreativeStudio,
} satisfies Meta<typeof CreativeStudio>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.CreativeStudio,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};
