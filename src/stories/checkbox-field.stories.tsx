import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxField } from "../components/fields";
const meta = {
  title: "Forms/Checkbox",
  component: CheckboxField,
  tags: ["autodocs"],
} satisfies Meta<typeof CheckboxField>;
export default meta;
export const Default: StoryObj<typeof CheckboxField> = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <CheckboxField
        label="Keep original images"
        description="Exports will be saved as separate files."
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
};
