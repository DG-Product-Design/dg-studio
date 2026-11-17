import type { Meta, StoryObj } from "@storybook/react-vite";
import { DrawerDemo } from "../examples/marketplace-partials";
const meta = {
  title: "Overlays/Settings drawer",
  component: DrawerDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof DrawerDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
