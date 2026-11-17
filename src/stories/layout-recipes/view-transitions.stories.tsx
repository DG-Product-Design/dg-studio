import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { TransitionGallery } from "../../examples/layout-recipes/transition-gallery";
const meta = {
  title: "Layout recipes/View transitions",
  component: TransitionGallery,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A shared-element gallery with grid/list layout morphing, keyed reordering and filtering, and an image/title transition into a detail view. Each instance owns unique transition names; only one transition runs at a time. React commits synchronously inside the capture callback, focus follows navigation, and unavailable APIs or reduced-motion preferences use immediate updates.",
      },
    },
  },
} satisfies Meta<typeof TransitionGallery>;
export default meta;
type Story = StoryObj<typeof meta>;
const explore: NonNullable<Story["play"]> = async ({
  canvas,
  canvasElement,
  userEvent,
  step,
}) => {
  const idle = () =>
    waitFor(
      () =>
        expect(canvas.getByRole("main")).toHaveAttribute("aria-busy", "false"),
      { timeout: 3000 },
    );
  await step("Morph the layout and reorder stable elements", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "List" }));
    await idle();
    await expect(canvas.getByRole("button", { name: "List" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    const lastCard = canvas.getAllByRole("button", { name: /^Open / }).at(-1)!;
    await userEvent.click(
      canvas.getByRole("button", { name: "Reverse order" }),
    );
    await idle();
    await expect(canvas.getAllByRole("button", { name: /^Open / })[0]).toBe(
      lastCard,
    );
  });
  await step("Open a shared image and return focus to its source", async () => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Open Get outside Campaigns" }),
    );
    await idle();
    await expect(
      canvas.getByRole("heading", { name: "Get outside" }),
    ).toHaveFocus();
    await userEvent.click(
      canvas.getByRole("button", { name: "Back to collection" }),
    );
    await idle();
    await expect(
      canvas.getByRole("button", { name: "Open Get outside Campaigns" }),
    ).toHaveFocus();
  });
  await step("Filter the collection and return to the grid", async () => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Collection" }));
    await userEvent.click(
      within(canvasElement.ownerDocument.body).getByRole("option", {
        name: "Campaigns",
      }),
    );
    await idle();
    await expect(
      canvas.getAllByRole("button", { name: /^Open / }),
    ).toHaveLength(3);
    await userEvent.click(canvas.getByRole("button", { name: "Grid" }));
    await idle();
  });
};
export const SharedElementGallery: Story = { play: explore };
export const WithoutViewTransitionAPI: Story = {
  args: { forceFallback: true },
  play: explore,
};
