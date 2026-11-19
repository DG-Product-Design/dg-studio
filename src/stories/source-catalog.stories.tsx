import type { Meta, StoryObj } from '@storybook/react-vite';
import { SourceCatalog } from '../docs/source-catalog';

const meta = {
  title: 'Source catalog/Marketplace',
  component: SourceCatalog,
} satisfies Meta<typeof SourceCatalog>;

export default meta;
export const Inventory: StoryObj<typeof SourceCatalog> = {};
