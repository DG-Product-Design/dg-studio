import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccountDemo } from "../examples/marketplace-planned";
import storyExamples1 from "../examples/marketplace-planned.tsx?examples";
const meta = {
  title: "Content/Accounts",
  component: AccountDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof AccountDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.AccountDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};
