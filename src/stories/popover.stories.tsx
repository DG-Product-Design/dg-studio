import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover } from "../components/navigation";
import { Button } from "../components/ui/button";
import { SwitchField } from "../components/fields";
const meta = {
  title: "Overlays/Popover",
  component: Popover,
  tags: ["autodocs"],
} satisfies Meta<typeof Popover>;
export default meta;
export const Default: StoryObj<typeof Popover> = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <Popover
        title="Preview settings"
        trigger={<Button variant="outline">Preview settings</Button>}
      >
        <SwitchField
          label="Show image names"
          checked={checked}
          onCheckedChange={setChecked}
        />
      </Popover>
    );
  },
};
