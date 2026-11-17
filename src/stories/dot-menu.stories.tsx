import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { DotMenuButton } from "../components/dot-menu-button";
import { DotMenuDemo } from "../examples/animation-studies";
const meta = {
  title: "Motion/Dot menu",
  component: DotMenuButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Three dots become a cross on click or hover. Separate transform layers preserve the top/bottom dot movement before the bars grow and rotate. This is the disclosure trigger; the consuming app owns its panel.",
      },
    },
  },
  render: (args) => <DotMenuDemo {...args} />,
} satisfies Meta<typeof DotMenuButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Click: Story = {
  args: { trigger: "click" },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Open menu" });
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await userEvent.keyboard(" ");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(button);
  },
};
export const Hover: Story = {
  args: { trigger: "hover" },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Open menu" });
    await userEvent.hover(button);
    await expect(button).toHaveAttribute("aria-expanded", "true");
    const top = button.querySelector<HTMLElement>(".dg-menu-dot-0")!;
    const bottom = button.querySelector<HTMLElement>(".dg-menu-dot-2")!;
    await waitFor(() =>
      expect(top.getBoundingClientRect().top).toBeCloseTo(
        bottom.getBoundingClientRect().top,
        0,
      ),
    );
    await userEvent.unhover(button);
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await waitFor(() =>
      expect(
        bottom.getBoundingClientRect().top - top.getBoundingClientRect().top,
      ).toBeCloseTo(20, 0),
    );
  },
};
