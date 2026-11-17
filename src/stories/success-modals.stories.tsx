import type { Meta, StoryObj } from "@storybook/react-vite";
import { SuccessModalDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Overlays/Success confirmations",
  component: SuccessModalDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof SuccessModalDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
