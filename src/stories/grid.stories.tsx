import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, Card } from '../components/content';

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
} satisfies Meta<typeof Grid>;

export default meta;

export const Default: StoryObj<typeof Grid> = {
  args: {
    children: ['Campaigns', 'Moodboards', 'Archive'].map((title) => (
      <Card key={title} title={title}>
        <p className="text-sm text-muted-foreground">
          A responsive column in the collection workspace.
        </p>
      </Card>
    )),
  },
};
