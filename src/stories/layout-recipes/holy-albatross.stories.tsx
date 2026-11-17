import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { HolyAlbatrossDemo } from "../../examples/layout-recipes/holy-albatross-demo";
const meta = {
  title: "Layout recipes/Holy albatross",
  component: HolyAlbatrossDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A layout that responds to its own available width. A flex-basis calculation switches between a 2:1 split and full-width stacked panels at a container width of 60rem, without media queries. Resize the container independently of the viewport.",
      },
    },
  },
} satisfies Meta<typeof HolyAlbatrossDemo>;
export default meta;
export const CollectionAndPreview: StoryObj<typeof meta> = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: /Get outside Campaigns/ }),
    );
    await expect(
      within(
        canvas.getByRole("complementary", { name: "Selected artwork" }),
      ).getByRole("heading"),
    ).toHaveTextContent("Get outside");
    await userEvent.click(canvas.getByRole("button", { name: "Narrow" }));
    const main = canvas
      .getByRole("region", { name: "Artworks" })
      .getBoundingClientRect();
    const aside = canvas
      .getByRole("complementary", { name: "Selected artwork" })
      .getBoundingClientRect();
    await expect(aside.top).toBeGreaterThan(main.bottom);
    await userEvent.click(canvas.getByRole("button", { name: "Wide" }));
  },
};
