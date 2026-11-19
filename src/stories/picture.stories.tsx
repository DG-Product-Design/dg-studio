import type { Meta, StoryObj } from '@storybook/react-vite';
import { Picture } from '../components/marketplace-content';
import { assets } from '../examples/assets';

const meta = {
  title: 'Media/Picture dissolve',
  component: Picture,
  tags: ['autodocs'],
  args: {
    src: assets[0].src,
    alt: assets[0].alt,
    width: 16,
    height: 9,
    dissolve: true,
    className: 'max-w-xl',
  },
} satisfies Meta<typeof Picture>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
