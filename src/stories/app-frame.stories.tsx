import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppFrameDemo } from "../examples/marketplace-planned";
import storyExamples1 from "../examples/marketplace-planned.tsx?examples";
const meta = {
  title: "Layout/App frame",
  component: AppFrameDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof AppFrameDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.AppFrameDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};
