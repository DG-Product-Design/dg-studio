import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddressDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Forms/Address",
  component: AddressDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof AddressDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
