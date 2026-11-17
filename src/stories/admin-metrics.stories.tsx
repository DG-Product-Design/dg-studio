import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdminMetricsBar } from "../components/account-components";

const meta = {
  title: "Content/Admin metrics",
  component: AdminMetricsBar,
  tags: ["autodocs"],
  args: { engaged: 42, total: 60, utilized: 35 },
} satisfies Meta<typeof AdminMetricsBar>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
