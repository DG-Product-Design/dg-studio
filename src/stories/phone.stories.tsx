import type { Meta, StoryObj } from '@storybook/react-vite';
import { Phone } from '../components/specialized-fields';

const meta = {
  title: 'Forms/Phone',
  component: Phone,
  tags: ['autodocs'],
  args: { label: 'Mobile number', defaultValue: '+1 602 555 0123' },
} satisfies Meta<typeof Phone>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
