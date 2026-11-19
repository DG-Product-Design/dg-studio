import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmployeeViewDemo } from "../examples/marketplace-planned";
import storyExamples1 from "../examples/marketplace-planned.tsx?examples";
const meta = {
  title: "Examples/Employee profile",
  component: EmployeeViewDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof EmployeeViewDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.EmployeeViewDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};
