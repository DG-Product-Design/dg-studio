import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagList } from '../components/content';

const meta = {
  title: 'Content/Tag list',
  component: TagList,
  tags: ['autodocs'],
} satisfies Meta<typeof TagList>;

export default meta;

export const Default: StoryObj<typeof TagList> = {
  args: { tags: ['Outdoors', 'Summer', 'Campaign'] },
};

export const Removable: StoryObj<typeof TagList> = {
  render: () => {
    const [tags, setTags] = useState(['Outdoors', 'Summer', 'Campaign']);

    return (
      <div className="space-y-3">
        <TagList tags={tags} onRemove={(tag) => setTags(tags.filter((t) => t !== tag))} />
        <p role="status" className="text-sm text-muted-foreground">
          {tags.length} tags
        </p>
      </div>
    );
  },
};
