import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreativeStudio } from "../examples/creative-studio";
const meta = {
  title: "Examples/Creative studio",
  component: CreativeStudio,
} satisfies Meta<typeof CreativeStudio>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
