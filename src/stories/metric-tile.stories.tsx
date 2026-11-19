import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricTile, Grid } from '../components/content';

const meta = {
  title: 'Content/Metric tile',
  component: MetricTile,
  tags: ['autodocs'],
  args: {
    label: 'Assets',
    value: 1284,
    description: 'Across all active collections',
    change: { label: '48 added this week', direction: 'up' },
  },
} satisfies Meta<typeof MetricTile>;

export default meta;
export const Default: StoryObj<typeof MetricTile> = {};
export const Loading: StoryObj<typeof MetricTile> = { args: { loading: true } };

export const Overview: StoryObj<typeof MetricTile> = {
  render: () => (
    <Grid>
      <MetricTile
        label="Assets"
        value={1284}
        change={{ label: '48 added this week', direction: 'up' }}
      />
      <MetricTile label="Approved" value={964} description="Ready for the next campaign" />
      <MetricTile
        label="Storage saved"
        value={2470000}
        description="Bytes saved through optimization"
      />
    </Grid>
  ),
};
