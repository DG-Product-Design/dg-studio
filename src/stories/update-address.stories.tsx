import type { Meta, StoryObj } from "@storybook/react-vite";
import { UpdateAddressDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Forms/Update address",
  component: UpdateAddressDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof UpdateAddressDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
