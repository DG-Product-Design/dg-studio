import type { Meta, StoryObj } from '@storybook/react-vite';
import { ElevationGuide } from '../docs/layout-guide';

const meta = {
  title: 'Foundations/Elevation',
  component: ElevationGuide,
  tags: ['autodocs'],
} satisfies Meta<typeof ElevationGuide>;

export default meta;
export const Default: StoryObj<typeof ElevationGuide> = {};
