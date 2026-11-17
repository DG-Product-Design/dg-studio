import { expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SplitScreenDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Layout/Split screen",
  component: SplitScreenDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof SplitScreenDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  play: async ({ canvas }) => {
    const image = canvas.getByRole("img");
    const frame = image.parentElement!;
    const panel = frame.parentElement!;
    const frameBounds = frame.getBoundingClientRect();
    const panelBounds = panel.getBoundingClientRect();
    await expect(frameBounds.right).toBeLessThanOrEqual(panelBounds.right + 1);
    await expect(frameBounds.bottom).toBeLessThanOrEqual(
      panelBounds.bottom + 1,
    );
    const button = canvas.getByRole("button", { name: "Log in" });
    button.scrollIntoView({ block: "center" });
    const buttonBounds = button.getBoundingClientRect();
    const hit = document.elementFromPoint(
      buttonBounds.x + buttonBounds.width / 2,
      buttonBounds.y + buttonBounds.height / 2,
    );
    await expect(button.contains(hit)).toBe(true);
  },
};
