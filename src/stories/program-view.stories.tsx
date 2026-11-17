import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgramViewDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Examples/Program details",
  component: ProgramViewDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof ProgramViewDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
