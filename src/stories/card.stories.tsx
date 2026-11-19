import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../components/content';
import { Button } from '../components/ui/button';

const meta = {
  title: 'Content/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    title: 'Campaign notes',
    description: 'A little context for the next revision.',
    children: (
      <p className="text-sm leading-relaxed">
        Keep the warm light, open sky, and oversized headline. Explore a quieter version for the
        feed.
      </p>
    ),
    footer: <Button variant="outline">Review notes</Button>,
    className: 'max-w-xl',
  },
} satisfies Meta<typeof Card>;

export default meta;
export const Default: StoryObj<typeof Card> = {};

export const Collapsible: StoryObj<typeof Card> = {
  args: { collapsible: true },
};

export const Collapsed: StoryObj<typeof Card> = {
  args: { collapsible: true, defaultOpen: false },
};
