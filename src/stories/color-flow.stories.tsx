import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { ColorFlow } from "../components/color-flow";
import { ColorFlowDemo } from "../examples/animation-studies";
const meta = {
  title: "Motion/Color flow",
  component: ColorFlow,
  tags: ["autodocs"],
  args: {
    from: "#e0eff5",
    to: "#8deecb",
    duration: 10000,
    interpolation: "oklch",
    dither: true,
  },
  argTypes: {
    from: { control: "color" },
    to: { control: "color" },
    interpolation: { control: "radio", options: ["oklch", "srgb"] },
    duration: { control: { type: "range", min: 2000, max: 30000, step: 1000 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A gently shifting color field. OKLCH interpolation and static monochrome noise soften visible color bands; transform motion avoids animating background-position. Includes a CSS fallback and reduced-motion support. Color depth and display processing can still cause banding.",
      },
    },
  },
} satisfies Meta<typeof ColorFlow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = {
  render: (args) => <ColorFlowDemo {...args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Pause motion" }));
    await expect(
      canvas.getByRole("button", { name: "Resume motion" }),
    ).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(canvas.getByRole("button", { name: "Dithering" }));
    await expect(
      canvas.getByRole("button", { name: "Dithering" }),
    ).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(canvas.getByRole("button", { name: "Dithering" }));
    await userEvent.click(
      canvas.getByRole("button", { name: "Resume motion" }),
    );
  },
};
export const CompareInterpolation: Story = {
  render: (args) => (
    <div className="grid max-w-5xl gap-4 sm:grid-cols-2">
      <ColorFlow {...args} paused interpolation="srgb" dither={false}>
        <h2 className="text-xl font-semibold">sRGB · no dithering</h2>
      </ColorFlow>
      <ColorFlow {...args} paused interpolation="oklch" dither>
        <h2 className="text-xl font-semibold">OKLCH · dithered</h2>
      </ColorFlow>
    </div>
  ),
};
