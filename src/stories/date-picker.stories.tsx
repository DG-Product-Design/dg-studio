import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "../components/specialized-fields";

const meta = {
  title: "Forms/Date picker",
  component: DatePicker,
  tags: ["autodocs"],
  args: {
    label: "Delivery date",
    defaultValue: "2026-11-20",
    min: "2026-11-16",
  },
} satisfies Meta<typeof DatePicker>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
