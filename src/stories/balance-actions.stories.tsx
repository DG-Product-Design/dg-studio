import type { Meta, StoryObj } from "@storybook/react-vite";
import { BalanceDemo } from "../examples/marketplace-partials";
import storyExamples1 from "../examples/marketplace-partials.tsx?examples";
const meta = {
  title: "Content/Balance actions",
  component: BalanceDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof BalanceDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.BalanceDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};
