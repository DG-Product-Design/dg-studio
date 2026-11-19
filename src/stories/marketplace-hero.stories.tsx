import { expect, waitFor } from 'storybook/test';
import { assets } from '../examples/assets';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeroDemo } from '../examples/marketplace-planned';
import storyExamples1 from '../examples/marketplace-planned.tsx?examples';

const meta = {
  title: 'Media/Marketplace hero',
  component: HeroDemo,
  tags: ['autodocs'],
  args: { blurBg: true, aspectRatio: '4 / 3' },
} satisfies Meta<typeof HeroDemo>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: { code: storyExamples1.HeroDemo, language: 'tsx', type: 'code' },
    },
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Next feature' }));
    const image = canvas.getByRole('img', { name: assets[1].alt });
    await waitFor(() => expect(image.parentElement).toHaveAttribute('data-image-state', 'loaded'));
    await expect(getComputedStyle(image).objectFit).toBe('contain');
    await expect(image.parentElement?.querySelector('[data-image-background]')).toHaveAttribute(
      'src',
      assets[1].src,
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Previous feature' }));
  },
};
