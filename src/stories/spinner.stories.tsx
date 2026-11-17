import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Spinner } from "../components/loaders";
const meta = {
  title: "Motion/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  args: { label: "Loading", size: 48 },
  argTypes: {
    color: { control: "color" },
    size: { control: { type: "range", min: 16, max: 96, step: 8 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A drawing-circle spinner with 1.2-second rotation and an independently drawing stroke. Color uses the color prop, --spinner-color, or the active theme’s primary token. Reduced motion leaves a static arc.",
      },
    },
  },
} satisfies Meta<typeof Spinner>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  play: async ({ canvas }) => {
    const svg = canvas.getByRole("status").querySelector("svg")!;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    await expect(getComputedStyle(svg).animationName).toBe(
      reduced ? "none" : "dg-spinner-rotate",
    );
    if (!reduced)
      await expect(
        getComputedStyle(svg.querySelector("circle")!).animationDuration,
      ).toBe("1.2s");
  },
};
export const Sizes: StoryObj<typeof meta> = {
  render: () => (
    <div className="flex items-center gap-8">
      {[16, 32, 64, 96].map((size) => (
        <div key={size} className="flex flex-col items-center gap-4">
          <Spinner size={size} label={`Loading at ${size} pixels`} />
          <span className="text-xs text-muted-foreground">{size}px</span>
        </div>
      ))}
    </div>
  ),
};
export const OriginalMint: StoryObj<typeof meta> = {
  args: { color: "#16df92", size: 80 },
  parameters: { canvasBackground: "#1e2432" },
};
