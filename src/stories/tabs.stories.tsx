import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from '../components/navigation';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;

export const Default: StoryObj<typeof Tabs> = {
  render: () => {
    const [value, setValue] = useState('overview');

    return (
      <div className="max-w-xl">
        <Tabs
          value={value}
          onValueChange={setValue}
          label="Collection views"
          items={[
            {
              value: 'overview',
              label: 'Overview',
              content: <p>Six assets in the Summer campaign.</p>,
            },
            {
              value: 'activity',
              label: 'Activity',
              content: <p>The dusk revision was approved today.</p>,
            },
            {
              value: 'billing',
              label: 'Billing',
              content: null,
              disabled: true,
            },
          ]}
        />
      </div>
    );
  },
};
