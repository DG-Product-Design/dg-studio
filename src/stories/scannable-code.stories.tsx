import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScannableCode } from '../components/foundation-primitives';

const meta = {
  title: 'Media/Scannable code',
  component: ScannableCode,
  tags: ['autodocs'],
  args: {
    src: './images/studio-qr.svg',
    alt: 'QR code linking to the original D.G component library',
  },
} satisfies Meta<typeof ScannableCode>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
