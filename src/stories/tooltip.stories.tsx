import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "../components/navigation";
import { Button } from "../components/ui/button";
import { Info } from "lucide-react";
const meta = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;
export default meta;
export const Default: StoryObj<typeof Tooltip> = {
  render: () => (
    <Tooltip content="Original files are preserved when you export.">
      <Button aria-label="About exports" variant="outline" size="icon">
        <Info aria-hidden />
      </Button>
    </Tooltip>
  ),
};
