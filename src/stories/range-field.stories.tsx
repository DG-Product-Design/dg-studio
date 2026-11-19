import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RangeField } from '../components/fields';

const meta = {
  title: 'Forms/Range slider',
  component: RangeField,
  tags: ['autodocs'],
} satisfies Meta<typeof RangeField>;

export default meta;

export const Default: StoryObj<typeof RangeField> = {
  render: () => {
    const [value, setValue] = useState(80);

    return (
      <div className="max-w-md">
        <RangeField
          label="Image quality"
          value={value}
          onChange={setValue}
          min={10}
          max={100}
          step={5}
          formatValue={(v) => `${v}%`}
        />
      </div>
    );
  },
};
