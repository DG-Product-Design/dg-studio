import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClickToCopy } from "../components/feedback";
const meta = {
  title: "Content/Click to copy",
  component: ClickToCopy,
  tags: ["autodocs"],
  args: {
    value: "var(--primary)",
    label: "Copy primary token",
    className: "max-w-lg",
  },
} satisfies Meta<typeof ClickToCopy>;
export default meta;
export const Default: StoryObj<typeof ClickToCopy> = {};
