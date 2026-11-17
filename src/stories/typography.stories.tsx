import type { Meta, StoryObj } from "@storybook/react-vite";
import { TypographyGuide } from "../docs/layout-guide";
const meta = {
  title: "Foundations/Typography",
  component: TypographyGuide,
  tags: ["autodocs"],
} satisfies Meta<typeof TypographyGuide>;
export default meta;
export const Default: StoryObj<typeof TypographyGuide> = {};
