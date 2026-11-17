import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListGroupDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Forms/List group",
  component: ListGroupDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof ListGroupDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
