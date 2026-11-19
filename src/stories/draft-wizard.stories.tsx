import type { Meta, StoryObj } from '@storybook/react-vite';
import { DraftWizardDemo } from '../examples/marketplace-partials';
import storyExamples1 from '../examples/marketplace-partials.tsx?examples';

const meta = {
  title: 'Forms/Draft wizard',
  component: DraftWizardDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof DraftWizardDemo>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.DraftWizardDemo,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};
