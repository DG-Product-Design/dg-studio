import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyCart } from '../components/commerce';

const meta = {
  title: 'Commerce/Empty cart',
  component: EmptyCart,
  tags: ['autodocs'],
  args: {
    onBack: () => {
      location.href = './?path=/story/commerce-cart--default';
    },
  },
} satisfies Meta<typeof EmptyCart>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
