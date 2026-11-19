import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TotalOdometer } from '../components/motion';
import { Button } from '../components/ui/button';

const meta = {
  title: 'Motion/Total odometer',
  component: TotalOdometer,
  tags: ['autodocs'],
  args: { value: 1284.5, currency: 'USD', locale: 'en-US' },
} satisfies Meta<typeof TotalOdometer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <div className="max-w-md space-y-6 rounded-xl border bg-card p-8">
        <p className="text-sm text-muted-foreground">Collection licensing total</p>
        <TotalOdometer {...args} value={value} />
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setValue(value + 49.95)}>Add $49.95</Button>
          <Button variant="outline" onClick={() => setValue(value - 49.95)}>
            Subtract $49.95
          </Button>
          <Button variant="ghost" onClick={() => setValue(0)}>
            Reset
          </Button>
        </div>
      </div>
    );
  },
};

export const Zero: Story = { args: { value: 0 } };
export const Negative: Story = { args: { value: -128.95 } };

export const Euro: Story = {
  args: { value: 9876.54, currency: 'EUR', locale: 'de-DE' },
};

export const Yen: Story = {
  args: { value: 1284, currency: 'JPY', locale: 'ja-JP' },
};
