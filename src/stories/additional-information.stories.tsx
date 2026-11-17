import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdditionalInfoDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Forms/Additional information",
  component: AdditionalInfoDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof AdditionalInfoDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
