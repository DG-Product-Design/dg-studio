import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from '../components/foundation-primitives';

const meta = {
  title: 'Navigation/Link',
  component: Link,
  tags: ['autodocs'],
  args: {
    children: 'Explore the component catalog',
    href: './?path=/story/source-catalog-marketplace--inventory',
    target: '_top',
  },
} satisfies Meta<typeof Link>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
