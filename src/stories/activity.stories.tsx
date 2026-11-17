import type { Meta, StoryObj } from "@storybook/react-vite";
import { Activity } from "../components/foundation-primitives";

const meta = {
  title: "Content/Activity",
  component: Activity,
  tags: ["autodocs"],
  args: { status: "active" },
} satisfies Meta<typeof Activity>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
