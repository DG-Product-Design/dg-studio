import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormNote } from '../components/foundation-primitives';

const meta = {
  title: 'Forms/Form note',
  component: FormNote,
  tags: ['autodocs'],
  args: { children: 'You can update these preferences later.' },
} satisfies Meta<typeof FormNote>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
