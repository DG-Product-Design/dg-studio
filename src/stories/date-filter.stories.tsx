import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterButtonDateRange } from "../components/table-tools";
import { useState } from "react";
const meta = {
  title: "Forms/Date range filter",
  component: FilterButtonDateRange,
  tags: ["autodocs"],
  args: { value: { from: "", to: "" }, onValueChange: () => {} },
} satisfies Meta<typeof FilterButtonDateRange>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  render: function Example() {
    const [value, setValue] = useState({ from: "", to: "" });
    return <FilterButtonDateRange value={value} onValueChange={setValue} />;
  },
};
