import type { Meta, StoryObj } from "@storybook/react-vite";
import { BalanceDemo } from "../examples/marketplace-partials";
const meta = {
  title: "Content/Balance actions",
  component: BalanceDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof BalanceDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
