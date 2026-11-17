import type { Meta, StoryObj } from "@storybook/react-vite";
import { CountBadge } from "../components/foundation-primitives";

const meta = {
  title: "Content/Count badge",
  component: CountBadge,
  tags: ["autodocs"],
  args: { count: 1250, tone: "info" },
} satisfies Meta<typeof CountBadge>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
