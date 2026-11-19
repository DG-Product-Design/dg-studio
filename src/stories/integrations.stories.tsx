import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntegrationDemo } from "../examples/marketplace-planned";
import storyExamples1 from "../examples/marketplace-planned.tsx?examples";
const meta = {
  title: "Examples/Directory integration",
  component: IntegrationDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof IntegrationDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.IntegrationDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};
