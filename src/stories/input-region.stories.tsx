import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputRegion } from "../components/foundation-primitives";
import { TextField } from "../components/fields";
const meta = {
  title: "Forms/Input group",
  component: InputRegion,
  tags: ["autodocs"],
  args: {
    label: "Contact details",
    children: <TextField label="Email" type="email" />,
  },
} satisfies Meta<typeof InputRegion>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
