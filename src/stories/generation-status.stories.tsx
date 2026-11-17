import type { Meta, StoryObj } from "@storybook/react-vite";
import { GenerationStatus } from "../components/motion";

const meta = {
  title: "AI/Generation status",
  component: GenerationStatus,
  tags: ["autodocs"],
  args: { label: "Updating your creative…" },
} satisfies Meta<typeof GenerationStatus>;
export default meta;
type Story = StoryObj<typeof meta>;
export const UpdatingCreative: Story = {};
