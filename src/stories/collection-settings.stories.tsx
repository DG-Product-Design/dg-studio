import type { Meta, StoryObj } from "@storybook/react-vite";
import { CollectionSettings } from "../examples/collection-settings";
const meta = {
  title: "Examples/Collection settings",
  component: CollectionSettings,
  tags: ["autodocs"],
} satisfies Meta<typeof CollectionSettings>;
export default meta;
export const Default: StoryObj<typeof CollectionSettings> = {};
