import type { Meta, StoryObj } from "@storybook/react-vite";
import { GenericFormDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Forms/Form",
  component: GenericFormDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof GenericFormDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
