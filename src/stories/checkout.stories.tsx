import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckoutDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Commerce/Checkout",
  component: CheckoutDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof CheckoutDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
