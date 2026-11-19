import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdditionalInfoDemo } from "../examples/marketplace-planned";
import storyExamples1 from "../examples/marketplace-planned.tsx?examples";
const meta = {
  title: "Forms/Additional information",
  component: AdditionalInfoDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof AdditionalInfoDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.AdditionalInfoDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};
