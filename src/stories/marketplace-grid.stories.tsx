import type { Meta, StoryObj } from "@storybook/react-vite";
import { GridDemo } from "../examples/marketplace-partials";
const meta = {
  title: "Layout/Marketplace grid",
  component: GridDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof GridDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
