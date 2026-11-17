import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReviewDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Content/Review confirmation",
  component: ReviewDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof ReviewDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
