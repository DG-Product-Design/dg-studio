import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SwitchField } from "../components/fields";
const meta = {
  title: "Forms/Switch",
  component: SwitchField,
  tags: ["autodocs"],
} satisfies Meta<typeof SwitchField>;
export default meta;
export const Default: StoryObj<typeof SwitchField> = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <div className="max-w-md">
        <SwitchField
          label="Auto-save changes"
          description="Save edits while you work."
          checked={checked}
          onCheckedChange={setChecked}
        />
      </div>
    );
  },
};
export const Disabled: StoryObj<typeof SwitchField> = {
  args: { label: "Auto-save changes", disabled: true, checked: true },
};
