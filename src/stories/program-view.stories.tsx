import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgramViewDemo } from "../examples/marketplace-planned";
import storyExamples1 from "../examples/marketplace-planned.tsx?examples";
const meta = {
  title: "Examples/Program details",
  component: ProgramViewDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof ProgramViewDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.ProgramViewDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};
