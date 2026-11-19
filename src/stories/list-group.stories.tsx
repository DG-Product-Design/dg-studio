import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListGroupDemo } from "../examples/marketplace-planned";
import storyExamples1 from "../examples/marketplace-planned.tsx?examples";
const meta = {
  title: "Forms/List group",
  component: ListGroupDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof ListGroupDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.ListGroupDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};
