import type { Meta, StoryObj } from "@storybook/react-vite";
import { PointConversionDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Forms/Point conversion",
  component: PointConversionDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof PointConversionDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
