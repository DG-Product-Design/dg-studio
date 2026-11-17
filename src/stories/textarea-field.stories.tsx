import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextareaDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Forms/Textarea field",
  component: TextareaDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof TextareaDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
