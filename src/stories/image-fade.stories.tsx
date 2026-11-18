import { expect, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ImageFade } from "../components/image-fade";
import { Button } from "../components/ui/button";
const meta = {
  title: "Media/Image fade",
  component: ImageFade,
  tags: ["autodocs"],
  argTypes: {
    blurBg: { control: "boolean" },
    aspectRatio: {
      control: "text",
      description:
        "Container ratio, e.g. 16 / 9 or 1. Defaults to width / height.",
    },
  },
  args: {
    src: "./images/welcome.jpg",
    alt: "Neon sunset over a wireframe landscape",
    width: 850,
    height: 680,
    className: "max-w-lg",
  },
} satisfies Meta<typeof ImageFade>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Failed: Story = { args: { src: "./images/does-not-exist.jpg" } };
export const BlurredBackground: Story = {
  args: {
    src: "./images/get-outside-dusk-portrait.webp",
    alt: "Get Outside lettering over a purple mountain sunset",
    width: 517,
    height: 761,
    blurBg: true,
    aspectRatio: "16 / 9",
  },
  play: async ({ canvas }) => {
    const foreground = canvas.getByRole("img");
    await waitFor(() =>
      expect(foreground.parentElement).toHaveAttribute(
        "data-image-state",
        "loaded",
      ),
    );
    const background = foreground.parentElement!.querySelector(
      "[data-image-background]",
    )!;
    await expect(getComputedStyle(foreground).objectFit).toBe("contain");
    await expect(getComputedStyle(background).objectFit).toBe("cover");
    await expect(getComputedStyle(background).filter).toContain("blur(");
    await expect(canvas.getAllByRole("img")).toHaveLength(1);
  },
};
export const LandscapeInPortrait: Story = {
  args: { blurBg: true, aspectRatio: "3 / 4", className: "max-w-xs" },
};
export const SourceChange: Story = {
  args: { blurBg: true, aspectRatio: "16 / 9" },
  play: async ({ canvas, userEvent }) => {
    const image = canvas.getByRole("img");
    await waitFor(() =>
      expect(image.parentElement).toHaveAttribute("data-image-state", "loaded"),
    );
    const before = image.parentElement!.getBoundingClientRect();
    await userEvent.click(
      canvas.getByRole("button", { name: "Change source" }),
    );
    const next = canvas.getByRole("img");
    await waitFor(() =>
      expect(next.parentElement).toHaveAttribute("data-image-state", "loaded"),
    );
    await expect(next).toHaveAttribute(
      "src",
      "./images/get-outside-dusk-portrait.webp",
    );
    await expect(
      next.parentElement?.querySelector("[data-image-background]"),
    ).toHaveAttribute("src", next.getAttribute("src"));
    await expect(next.parentElement!.getBoundingClientRect().height).toBe(
      before.height,
    );
  },
  render: (args) => {
    const [dusk, setDusk] = useState(false);
    return (
      <div className="space-y-4">
        <ImageFade
          {...args}
          src={
            dusk
              ? "./images/get-outside-dusk-portrait.webp"
              : "./images/get-outside-v1.webp"
          }
          width={1034}
          height={1521}
        />
        <Button onClick={() => setDusk(!dusk)}>Change source</Button>
      </div>
    );
  },
};
