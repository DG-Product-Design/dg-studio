import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddressDemo } from "../examples/marketplace-planned";
import storyExamples1 from "../examples/marketplace-planned.tsx?examples";
const meta = {
  title: "Forms/Address",
  component: AddressDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof AddressDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.AddressDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};
