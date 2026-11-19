import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormCheckoutUserInfo } from '../components/form-compositions';

const meta = {
  title: 'Forms/Checkout information',
  component: FormCheckoutUserInfo,
  tags: ['autodocs'],
  args: { onSubmit: () => {} },
} satisfies Meta<typeof FormCheckoutUserInfo>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
