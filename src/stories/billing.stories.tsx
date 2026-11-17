import type { Meta, StoryObj } from "@storybook/react-vite";
import { BillingDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Examples/Profile and billing",
  component: BillingDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof BillingDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
