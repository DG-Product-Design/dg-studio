import { expect, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageCarousel } from "../components/media";
import { assets } from "../examples/assets";
const meta = {
  title: "Media/Carousel",
  component: ImageCarousel,
  tags: ["autodocs"],
  args: { images: assets.slice(0, 3), blurBg: true, aspectRatio: "16 / 9" },
} satisfies Meta<typeof ImageCarousel>;
export default meta;
export const Default: StoryObj<typeof meta> = {};

export const Looping: StoryObj<typeof ImageCarousel> = {
  args: { images: assets, loop: true, dots: true },
};

export const LoopAndChooseSlide: StoryObj<typeof meta> = {
  ...Looping,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Previous image" }),
    );
    await expect(canvas.getByText("6 of 6")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Next image" }));
    await expect(canvas.getByText("1 of 6")).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Go to image 3" }),
    );
    await expect(canvas.getByText("3 of 6")).toBeVisible();
    const image = canvas.getByRole("img", { name: assets[2].alt });
    await waitFor(() =>
      expect(image.parentElement).toHaveAttribute("data-image-state", "loaded"),
    );
    await expect(getComputedStyle(image).objectFit).toBe("contain");
    await expect(
      image.parentElement?.querySelector("[data-image-background]"),
    ).toHaveAttribute("src", assets[2].src);
    await expect(getComputedStyle(image.parentElement!).aspectRatio).toBe(
      "16 / 9",
    );
    await expect(
      canvas.getByRole("button", { name: "Go to image 3" }),
    ).toHaveAttribute("aria-current", "true");
  },
};
