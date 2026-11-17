import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checklist } from "../components/fields";
const meta = {
  title: "Forms/Checklist",
  component: Checklist,
  tags: ["autodocs"],
} satisfies Meta<typeof Checklist>;
export default meta;
export const Default: StoryObj<typeof Checklist> = {
  render: () => {
    const [value, setValue] = useState(["web"]);
    return (
      <Checklist
        label="Export destinations"
        value={value}
        onValueChange={setValue}
        options={[
          {
            value: "web",
            label: "Website",
            description: "Optimized images for your site.",
          },
          {
            value: "social",
            label: "Social channels",
            description: "Feed and story formats.",
          },
          {
            value: "print",
            label: "Print",
            description: "Available after approval.",
            disabled: true,
          },
        ]}
      />
    );
  },
};
