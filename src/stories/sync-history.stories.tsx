import type { Meta, StoryObj } from "@storybook/react-vite";
import { SyncHistoryDemo } from "../examples/marketplace-planned";
import storyExamples1 from "../examples/marketplace-planned.tsx?examples";
const meta = {
  title: "Overlays/Sync history",
  component: SyncHistoryDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof SyncHistoryDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.SyncHistoryDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};
