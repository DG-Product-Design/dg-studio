import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmployeeImportDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Forms/Add employees",
  component: EmployeeImportDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof EmployeeImportDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
