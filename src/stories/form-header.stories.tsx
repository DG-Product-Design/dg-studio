import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormHeader } from "../components/foundation-primitives";

const meta = {
  title: "Forms/Form header",
  component: FormHeader,
  tags: ["autodocs"],
  args: {
    title: "Prepare your collection",
    description: "Add the details your team will need.",
  },
} satisfies Meta<typeof FormHeader>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
