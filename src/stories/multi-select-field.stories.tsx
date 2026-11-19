import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MultiSelectField } from '../components/fields';

const meta = {
  title: 'Forms/Multiple selection',
  component: MultiSelectField,
  tags: ['autodocs'],
} satisfies Meta<typeof MultiSelectField>;

export default meta;

export const Default: StoryObj<typeof MultiSelectField> = {
  render: () => {
    const [value, setValue] = useState(['outdoors']);

    return (
      <MultiSelectField
        label="Tags"
        hint="Choose all that fit this collection."
        value={value}
        onValueChange={setValue}
        options={[
          {
            value: 'outdoors',
            label: 'Outdoors',
            description: 'Trails, landscapes, and open space.',
          },
          { value: 'summer', label: 'Summer' },
          { value: 'social', label: 'Social' },
        ]}
        className="max-w-md"
      />
    );
  },
};
