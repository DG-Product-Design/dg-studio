import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardWithAction } from "../components/content";
import { Button } from "../components/ui/button";
import { FolderOpen } from "lucide-react";
const meta = {
  title: "Content/Card with action",
  component: CardWithAction,
  tags: ["autodocs"],
} satisfies Meta<typeof CardWithAction>;
export default meta;
export const Default: StoryObj<typeof CardWithAction> = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="max-w-xl space-y-4">
        <CardWithAction
          title="Summer campaign"
          description="Six assets ready for review."
          icon={<FolderOpen />}
          action={
            <Button onClick={() => setOpen(!open)}>
              {open ? "Hide summary" : "View summary"}
            </Button>
          }
        />
        {open && (
          <p role="status">
            The collection includes posters, stories, and moodboard references.
          </p>
        )}
      </div>
    );
  },
};
