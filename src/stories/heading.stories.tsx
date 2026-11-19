import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from '../components/foundation-primitives';

const meta = {
  title: 'Foundations/Heading',
  component: Heading,
  tags: ['autodocs'],
  args: { children: 'A considered interface', level: 2 },
} satisfies Meta<typeof Heading>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
