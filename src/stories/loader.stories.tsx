import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, waitFor } from "storybook/test";
import { Loader } from "../components/loaders";
import { Button } from "../components/ui/button";
import { useTheme } from "../components/theme";
const meta = {
  title: "Motion/Loader",
  component: Loader,
  tags: ["autodocs"],
  parameters: {
    canvasBackground: "#ffffff",
    docs: {
      description: {
        component:
          "The original marketplace F: a brief fade, a delayed 3D rotation and scale reveal, then two continuous waves beneath the letter. Original purple/white colors and timing are the defaults. Reduced motion shows the finished mark without animation.",
      },
    },
  },
  argTypes: {
    backgroundColor: { control: "color" },
    foregroundColor: { control: "color" },
    scaleDuration: {
      control: { type: "range", min: 100, max: 3000, step: 100 },
    },
    waveDuration: {
      control: { type: "range", min: 1000, max: 12000, step: 500 },
    },
    startScale: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    duration: { table: { disable: true } },
  },
} satisfies Meta<typeof Loader>;
export default meta;
export const Default: StoryObj<typeof meta> = {};

export const Replay: StoryObj<typeof meta> = {
  render: (args) => {
    const [replay, setReplay] = useState(0);
    return (
      <div className="flex max-w-sm flex-col items-center gap-6 rounded-xl border bg-card p-6">
        <Loader {...args} key={replay} />
        <Button
          variant="outline"
          onClick={() => setReplay((value) => value + 1)}
        >
          Replay entrance
        </Button>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const previous = canvas.getByRole("status").querySelector("svg");
    await userEvent.click(
      canvas.getByRole("button", { name: "Replay entrance" }),
    );
    const current = canvas.getByRole("status").querySelector("svg")!;
    await expect(current).not.toBe(previous);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    await expect(getComputedStyle(current).animationName).toBe(
      reduced ? "none" : "dg-loader-fade-in, dg-loader-rotate-in",
    );
    const waves = current.querySelectorAll<SVGPathElement>(".dg-wave");
    await expect(waves).toHaveLength(2);
    if (!reduced) {
      await expect(getComputedStyle(current).animationDelay).toBe("0.1s, 1s");
      await expect(getComputedStyle(waves[0]).animationDuration).toBe("6s");
      const transform = getComputedStyle(waves[0]).transform;
      await waitFor(() =>
        expect(getComputedStyle(waves[0]).transform).not.toBe(transform),
      );
    }
  },
};

function ThemedLoader(args: React.ComponentProps<typeof Loader>) {
  const theme = useTheme();
  return (
    <Loader
      {...args}
      backgroundColor={
        theme === "miami-85" ? "var(--secondary)" : args.backgroundColor
      }
      foregroundColor={
        theme === "miami-85" ? "var(--background)" : args.foregroundColor
      }
    />
  );
}

export const Themed: StoryObj<typeof meta> = {
  render: (args) => <ThemedLoader {...args} />,
  parameters: {
    canvasBackground: "var(--background)",
  },
  args: {
    backgroundColor: "var(--primary)",
    foregroundColor: "var(--primary-foreground)",
  },
};
