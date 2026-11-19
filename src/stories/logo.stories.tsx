import type { Meta, StoryObj } from '@storybook/react-vite';
import { Logo } from '../components/foundation-primitives';

const meta = {
  title: 'Foundations/Logo',
  component: Logo,
  tags: ['autodocs'],
  args: { href: './?path=/story/welcome--start-here' },
} satisfies Meta<typeof Logo>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
