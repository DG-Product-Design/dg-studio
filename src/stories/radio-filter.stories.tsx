import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterButtonRadio } from "../components/table-tools";
import { useState } from "react";
const meta = {
  title: "Forms/Radio filter",
  component: FilterButtonRadio,
  tags: ["autodocs"],
  args: {
    label: "Status",
    value: "all",
    options: [
      { value: "all", label: "All" },
      { value: "active", label: "Active" },
    ],
    onValueChange: () => {},
  },
} satisfies Meta<typeof FilterButtonRadio>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  render: function Example() {
    const [value, setValue] = useState("all");
    return (
      <FilterButtonRadio
        label="Status"
        value={value}
        onValueChange={setValue}
        options={[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
        ]}
      />
    );
  },
};
