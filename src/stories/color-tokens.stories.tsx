import type { Meta, StoryObj } from '@storybook/react-vite';
import { TokenGuide } from '../docs/token-guide';

const meta = {
  title: 'Foundations/Color tokens',
  component: TokenGuide,
  tags: ['autodocs'],
} satisfies Meta<typeof TokenGuide>;

export default meta;
export const Default: StoryObj<typeof TokenGuide> = {};
