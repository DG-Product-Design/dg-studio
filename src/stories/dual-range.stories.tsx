import type { Meta, StoryObj } from "@storybook/react-vite";
import { DualRangeDemo } from "../examples/marketplace-partials";
import storyExamples1 from "../examples/marketplace-partials.tsx?examples";
const meta = {
  title: "Forms/Dual range",
  component: DualRangeDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof DualRangeDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.DualRangeDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};
