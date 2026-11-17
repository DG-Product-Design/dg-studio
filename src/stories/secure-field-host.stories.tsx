import type { Meta, StoryObj } from "@storybook/react-vite";
import { SecureFieldHostDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Forms/Secure field host",
  component: SecureFieldHostDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof SecureFieldHostDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
