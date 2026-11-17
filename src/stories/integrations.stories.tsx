import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntegrationDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Examples/Directory integration",
  component: IntegrationDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof IntegrationDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
