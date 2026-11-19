import type { Meta, StoryObj } from "@storybook/react-vite";
import { GridDemo } from "../examples/marketplace-partials";
import storyExamples1 from "../examples/marketplace-partials.tsx?examples";
const meta = {
  title: "Layout/Marketplace grid",
  component: GridDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof GridDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: { code: storyExamples1.GridDemo, language: "tsx", type: "code" },
    },
  },
};
