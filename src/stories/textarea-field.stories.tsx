import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextareaDemo } from "../examples/marketplace-planned";
import storyExamples1 from "../examples/marketplace-planned.tsx?examples";
const meta = {
  title: "Forms/Textarea field",
  component: TextareaDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof TextareaDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.TextareaDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};
