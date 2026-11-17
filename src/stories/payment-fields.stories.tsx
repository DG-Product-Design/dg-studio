import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaymentFieldsDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Forms/Payment fields",
  component: PaymentFieldsDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof PaymentFieldsDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
