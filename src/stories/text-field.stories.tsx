import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from '../components/fields';

const meta = {
  title: 'Forms/Text field',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: 'Collection name',
    hint: 'Give this collection a name you’ll recognize.',
    placeholder: 'Summer trail campaign',
    className: 'max-w-md',
  },
} satisfies Meta<typeof TextField>;

export default meta;
export const Default: StoryObj<typeof TextField> = {};

export const Invalid: StoryObj<typeof TextField> = {
  args: { defaultValue: 'ab', error: 'Use at least 3 characters.' },
};

export const Disabled: StoryObj<typeof TextField> = {
  args: { defaultValue: 'Archived collection', disabled: true },
};

export const Password: StoryObj<typeof TextField> = {
  args: {
    label: 'Access code',
    type: 'password',
    hint: 'Enter the code supplied by your team.',
    autoComplete: 'off',
  },
};
