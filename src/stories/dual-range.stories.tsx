import type { Meta, StoryObj } from "@storybook/react-vite";
import { DualRangeDemo } from "../examples/marketplace-partials";
const meta = {
  title: "Forms/Dual range",
  component: DualRangeDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof DualRangeDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
