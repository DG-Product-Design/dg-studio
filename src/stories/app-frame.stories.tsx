import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppFrameDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Layout/App frame",
  component: AppFrameDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof AppFrameDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
