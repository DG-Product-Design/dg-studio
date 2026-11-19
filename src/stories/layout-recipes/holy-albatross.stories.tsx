import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { HolyAlbatrossDemo } from "../../examples/layout-recipes/holy-albatross-demo";
import demoSource from "../../examples/layout-recipes/holy-albatross-demo.tsx?raw";
const meta = {
  title: "Layout recipes/Holy albatross",
  component: HolyAlbatrossDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: demoSource,
        language: "tsx",
        type: "code",
      },
      description: {
        component: `A layout that responds to its own available width, without media queries. This demo uses a 40rem container breakpoint: widen it to place the collection and preview on one row, or narrow it to stack them.

This is a CSS recipe applied to ordinary HTML. Use the three classes below and set --dg-albatross-breakpoint in CSS to suit the available space; the recipe defaults to 40rem.

\`\`\`html
<div class="dg-albatross">
  <section class="dg-albatross-main">Collection</section>
  <aside class="dg-albatross-aside">Selected artwork</aside>
</div>
\`\`\`

The layout needs no JavaScript; the demo uses React state only for its width slider and artwork selection. The trick is the flex-basis calculation. Here is the CSS behind this example:

\`\`\`css
.dg-albatross {
  --dg-albatross-breakpoint: 40rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.dg-albatross > * {
  /* 100% is the flex container's inner width, not the viewport. */
  flex-basis: calc((var(--dg-albatross-breakpoint) - 100%) * 999);
  min-width: min(100%, 15rem);
  max-width: 100%;
}

.dg-albatross-main { flex-grow: 1; }
.dg-albatross-aside { flex-grow: 0.5; }
\`\`\`

- **Below 40rem:** the subtraction is positive. Multiplying by 999 makes the requested basis very large; max-width caps each panel at the container width, so flex-wrap puts them on separate rows.
- **Above 40rem:** the subtraction is negative, and the basis is clamped to zero. The panels share a row and grow in a 2:1 ratio, subject to their minimum widths.
- **At small widths:** min-width keeps each panel at least 15rem wide when space allows, but lets it shrink to the container width on smaller screens.

The multiplier makes the change abrupt rather than a gradual resize. The container's available width controls the switch, so the same layout can stack in a sidebar and sit side by side in a wider workspace. Try Narrow and Wide below without resizing your browser.`,
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
    // Match the available space in the embedded Docs canvas.
    const demo = canvas.getByRole("main");
    const originalMaxWidth = demo.style.maxWidth;
    demo.style.maxWidth = "900px";
    try {
      const collection = canvas
        .getByRole("region", { name: "Artworks" })
        .getBoundingClientRect();
      const preview = canvas
        .getByRole("complementary", { name: "Selected artwork" })
        .getBoundingClientRect();
      const layout = canvas
        .getByRole("region", { name: "Artworks" })
        .closest(".dg-albatross")!;
      const breakpoint =
        40 * parseFloat(getComputedStyle(document.documentElement).fontSize);
      if (layout.clientWidth > breakpoint) {
        await expect(
          Math.abs(preview.top - collection.top),
          "Wide panels should share one row inside the Docs canvas",
        ).toBeLessThan(1);
        await expect(preview.left).toBeGreaterThan(collection.right);
      } else {
        await expect(preview.top).toBeGreaterThan(collection.bottom);
      }
    } finally {
      demo.style.maxWidth = originalMaxWidth;
    }
  },
};
