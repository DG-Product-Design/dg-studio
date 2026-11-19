import type { Meta, StoryObj } from "@storybook/react-vite";
import { PointConversionDemo } from "../examples/marketplace-planned";
import storyExamples1 from "../examples/marketplace-planned.tsx?examples";
const meta = {
  title: "Forms/Point conversion",
  component: PointConversionDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof PointConversionDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.PointConversionDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};
