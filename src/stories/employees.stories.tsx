import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmployeeImportDemo } from '../examples/marketplace-planned';
import storyExamples1 from '../examples/marketplace-planned.tsx?examples';

const meta = {
  title: 'Forms/Add employees',
  component: EmployeeImportDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof EmployeeImportDemo>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.EmployeeImportDemo,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};
