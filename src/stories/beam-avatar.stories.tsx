import type { Meta, StoryObj } from '@storybook/react-vite';
import { BeamAvatar } from '../components/marketplace-content';

const meta = {
  title: 'Content/Illustrated avatar',
  component: BeamAvatar,
  tags: ['autodocs'],
  args: { name: 'D.G', size: 80 },
} satisfies Meta<typeof BeamAvatar>;

export default meta;
export const Default: StoryObj<typeof meta> = {};

export const People: StoryObj<typeof meta> = {
  render: () => (
    <div className="flex gap-4">
      {['D.G', 'Maya Chen', 'Sam Rivera', 'Alex Kim'].map((name) => (
        <BeamAvatar key={name} name={name} size={64} />
      ))}
    </div>
  ),
};
