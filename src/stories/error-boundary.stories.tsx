import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorBoundaryDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Feedback/Error boundary",
  component: ErrorBoundaryDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorBoundaryDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
