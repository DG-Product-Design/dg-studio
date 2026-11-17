import type { Meta, StoryObj } from "@storybook/react-vite";
import { VendorTagsDemo } from "../examples/marketplace-partials";
const meta = {
  title: "Content/Vendor tags",
  component: VendorTagsDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof VendorTagsDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
