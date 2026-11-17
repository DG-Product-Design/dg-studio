import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmployeeViewDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Examples/Employee profile",
  component: EmployeeViewDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof EmployeeViewDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
