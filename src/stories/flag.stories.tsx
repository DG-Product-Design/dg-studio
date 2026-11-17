import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flag } from "../components/foundation-primitives";

const meta = {
  title: "Feedback/Flag",
  component: Flag,
  tags: ["autodocs"],
  args: { children: "Complete the required fields.", tone: "danger" },
} satisfies Meta<typeof Flag>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
