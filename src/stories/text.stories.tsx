import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "../components/foundation-primitives";

const meta = {
  title: "Foundations/Text",
  component: Text,
  tags: ["autodocs"],
  args: { children: "Good interfaces make the next step clear.", muted: true },
} satisfies Meta<typeof Text>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
