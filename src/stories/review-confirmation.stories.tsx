import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReviewDemo } from "../examples/marketplace-planned";
import storyExamples1 from "../examples/marketplace-planned.tsx?examples";
const meta = {
  title: "Content/Review confirmation",
  component: ReviewDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof ReviewDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.ReviewDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};
