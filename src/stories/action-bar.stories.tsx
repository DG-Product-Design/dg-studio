import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionBar } from '../components/content';
import { Button } from '../components/ui/button';

const meta = {
  title: 'Content/Action bar',
  component: ActionBar,
  tags: ['autodocs'],
} satisfies Meta<typeof ActionBar>;

export default meta;

export const Default: StoryObj<typeof ActionBar> = {
  render: () => {
    const [count, setCount] = useState(3);

    return (
      <ActionBar summary={`${count} images selected`}>
        <Button variant="outline" disabled={!count} onClick={() => setCount(0)}>
          Clear selection
        </Button>
        <Button disabled={!count} onClick={() => setCount(0)}>
          Archive selected
        </Button>
      </ActionBar>
    );
  },
};
