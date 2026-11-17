import type { Meta, StoryObj } from "@storybook/react-vite";
import { CollectionTable } from "../examples/collection-table";
const meta = {
  title: "Examples/Collection manager",
  component: CollectionTable,
  tags: ["autodocs"],
} satisfies Meta<typeof CollectionTable>;
export default meta;
export const Default: StoryObj<typeof CollectionTable> = {};
