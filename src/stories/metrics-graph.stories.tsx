import type { Meta, StoryObj } from "@storybook/react-vite";
import { MetricsDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Content/Metrics graph",
  component: MetricsDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof MetricsDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
