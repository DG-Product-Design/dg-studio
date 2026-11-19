import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CartAnimation } from '../components/cart-animation';
import { Button } from '../components/ui/button';

const meta = {
  title: 'Motion/Cart animation',
  component: CartAnimation,
  tags: ['autodocs'],
} satisfies Meta<typeof CartAnimation>;

export default meta;

export const Interactive: StoryObj<typeof CartAnimation> = {
  render: () => {
    const [active, setActive] = useState(false);

    return (
      <div className="flex max-w-md items-center gap-6 rounded-xl border bg-card p-6">
        <CartAnimation active={active} />
        <div>
          <p role="status" className="mb-3 text-sm">
            {active ? 'Added to your cart.' : 'Your cart is empty.'}
          </p>
          <Button variant={active ? 'outline' : 'default'} onClick={() => setActive(!active)}>
            {active ? 'Remove item' : 'Add item'}
          </Button>
        </div>
      </div>
    );
  },
};
