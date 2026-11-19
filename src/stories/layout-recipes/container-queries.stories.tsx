import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ContainerWorkspace } from "../../examples/layout-recipes/container-workspace";
import storyExamples1 from "../../examples/layout-recipes/container-workspace.tsx?examples";
const meta = {
  title: "Layout recipes/Container queries",
  component: ContainerWorkspace,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Nested named containers control the outer workspace and each reusable asset card independently. Cards move from stacked to horizontal to a three-column metadata view at 24rem and 42rem; the workspace gains an inspector column at 64rem. Type uses cqi units; density uses inherited custom properties with progressive style-query enhancement. The narrow inspector renders the same card component as the wide collection.",
      },
    },
  },
} satisfies Meta<typeof ContainerWorkspace>;
export default meta;
export const AdaptiveWorkspace: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.ContainerWorkspace,
        language: "tsx",
        type: "code",
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const workspace = canvas.getByRole("region", {
      name: "Collection workspace",
    });
    await userEvent.click(
      within(workspace).getAllByRole("button", { name: "Select artwork" })[0],
    );
    await expect(
      canvas.getByRole("status", { name: "Selected artwork" }),
    ).toHaveTextContent("After the sunset");
    await userEvent.click(
      canvas.getByRole("button", { name: "Compact density" }),
    );
    await expect(
      canvas.getByRole("button", { name: "Compact density" }),
    ).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(canvas.getByRole("button", { name: "Narrow" }));
    const inspector = canvas.getByRole("complementary", {
      name: "Artwork inspector",
    });
    await expect(inspector.getBoundingClientRect().top).toBeGreaterThan(
      workspace.getBoundingClientRect().bottom,
    );
    const first = workspace.querySelector(".dg-query-card-layout")!;
    await expect(
      getComputedStyle(first).gridTemplateColumns.split(" "),
    ).toHaveLength(1);
    await userEvent.click(canvas.getByRole("button", { name: "Wide" }));
  },
};
