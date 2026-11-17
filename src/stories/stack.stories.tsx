import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../components/content";
import { Button } from "../components/ui/button";
const meta = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
} satisfies Meta<typeof Stack>;
export default meta;
export const Vertical: StoryObj<typeof Stack> = {
  args: {
    children: (
      <>
        <span>Collection title</span>
        <span className="text-sm text-muted-foreground">
          Supporting context
        </span>
      </>
    ),
  },
};
export const Horizontal: StoryObj<typeof Stack> = {
  args: {
    direction: "horizontal",
    children: (
      <>
        <Button>Save changes</Button>
        <Button variant="outline">Cancel</Button>
      </>
    ),
  },
};
