import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayoutGuide } from '../docs/layout-guide';

const meta = {
  title: 'Foundations/Spacing and breakpoints',
  component: LayoutGuide,
  tags: ['autodocs'],
} satisfies Meta<typeof LayoutGuide>;

export default meta;
export const Default: StoryObj<typeof LayoutGuide> = {};
