import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccountDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Content/Accounts",
  component: AccountDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof AccountDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
