import { expect } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from '../components/data-table';

const meta = {
  title: 'Content/Data table',
  component: DataTable,
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable>;

export default meta;

export const Default: StoryObj = {
  render: () => (
    <DataTable
      rows={[
        { id: '1', name: 'Dusk study', status: 'Draft' },
        { id: '2', name: 'The scenic route', status: 'Approved' },
      ]}
      columns={[
        {
          id: 'name',
          header: 'Name',
          cell: (row) => row.name,
          sortValue: (row) => row.name,
        },
        { id: 'status', header: 'Status', cell: (row) => row.status },
      ]}
      getRowId={(row) => row.id}
      getRowLabel={(row) => row.name}
      caption="Campaign assets"
    />
  ),
};

export const Empty: StoryObj = {
  render: () => (
    <DataTable
      rows={[] as { id: string; name: string }[]}
      columns={[{ id: 'name', header: 'Name', cell: (row) => row.name }]}
      getRowId={(row) => row.id}
      getRowLabel={(row) => row.name}
      caption="Campaign assets"
    />
  ),
};

export const Loading: StoryObj = {
  render: () => (
    <DataTable
      loading
      rows={[] as { id: string; name: string; status: string }[]}
      columns={[
        { id: 'name', header: 'Name', cell: (row) => row.name },
        { id: 'status', header: 'Status', cell: (row) => row.status },
      ]}
      getRowId={(row) => row.id}
      getRowLabel={(row) => row.name}
      onSelectionChange={() => {}}
      pageSize={4}
      caption="Loading campaign assets"
    />
  ),
  play: async ({ canvas }) => {
    const table = canvas.getByRole('table', {
      name: 'Loading campaign assets',
    });

    await expect(table).toHaveAttribute('aria-busy', 'true');
    await expect(table.querySelectorAll('tbody tr')).toHaveLength(4);
    await expect(table.querySelectorAll('[data-loading-cell]')).toHaveLength(8);
    await expect(canvas.getByRole('checkbox', { name: 'Select all visible rows' })).toBeDisabled();
    await expect(canvas.queryByText('No results')).toBeNull();
  },
};
