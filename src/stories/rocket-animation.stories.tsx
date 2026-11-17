import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { RocketAnimation } from "../components/rocket-animation";
import { Button } from "../components/ui/button";

const meta = {
  title: "Motion/Rocket animation",
  component: RocketAnimation,
  tags: ["autodocs"],
  args: { size: 128, playing: true, loop: true, label: "Rocket animation" },
  parameters: {
    docs: {
      description: {
        component:
          "D.G’s original rocket animation. Reduced motion displays the first frame. The artwork and player load on demand.",
      },
    },
  },
} satisfies Meta<typeof RocketAnimation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvas }) => {
    const rocket = canvas.getByRole("img", { name: "Rocket animation" });
    await waitFor(() => expect(rocket.querySelector("svg")).not.toBeNull());
  },
};
export const Replay: Story = {
  render: (args) => {
    const [replay, setReplay] = useState(0);
    return (
      <div className="flex max-w-sm flex-col items-center gap-5 rounded-xl border bg-card p-6">
        <RocketAnimation {...args} loop={false} key={replay} />
        <Button
          variant="outline"
          onClick={() => setReplay((value) => value + 1)}
        >
          Replay rocket
        </Button>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const original = canvas.getByRole("img", { name: "Rocket animation" });
    await waitFor(() => expect(original.querySelector("svg")).not.toBeNull());
    await userEvent.click(
      canvas.getByRole("button", { name: "Replay rocket" }),
    );
    const next = canvas.getByRole("img", { name: "Rocket animation" });
    await expect(next).not.toBe(original);
    await waitFor(() => expect(next.querySelector("svg")).not.toBeNull());
  },
};
