import type { Meta, StoryObj } from "@storybook/react-vite";
import { SyncHistoryDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Overlays/Sync history",
  component: SyncHistoryDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof SyncHistoryDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
