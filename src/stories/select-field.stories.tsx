import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectField } from "../components/fields";
import { expect, userEvent, waitFor, within } from "storybook/test";
const options = [
  {
    value: "campaign",
    label: "Campaign",
    description: "Creative for one launch.",
  },
  {
    value: "moodboard",
    label: "Moodboard",
    description: "Visual references and inspiration.",
  },
  { value: "archive", label: "Archive", disabled: true },
];
function Example() {
  const [value, setValue] = useState("");
  return (
    <SelectField
      label="Collection type"
      options={options}
      value={value}
      onValueChange={setValue}
      hint="Archived collections are read only."
      className="max-w-sm"
    />
  );
}
const meta = {
  title: "Forms/Select field",
  component: SelectField,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectField>;
export default meta;
export const Default: StoryObj<typeof SelectField> = {
  render: () => <Example />,
};
export const KeyboardSelection: StoryObj<typeof SelectField> = {
  render: () => <Example />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("combobox"));
    await userEvent.keyboard("{Home}");
    await waitFor(() =>
      expect(
        within(canvasElement.ownerDocument.body).getByRole("option", {
          name: /Campaign/,
        }),
      ).toHaveFocus(),
    );
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("combobox")).toHaveTextContent("Campaign");
  },
};
export const Disabled: StoryObj<typeof SelectField> = {
  args: {
    label: "Collection type",
    options,
    value: "campaign",
    onValueChange: () => {},
    disabled: true,
  },
};
