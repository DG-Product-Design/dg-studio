import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  ItemEntranceStudy,
  PanelRevealStudy,
  ScaleAndFadeStudy,
  StaggerStudy,
} from "../examples/framer-motion-variants";
import storyExamples1 from "../examples/framer-motion-variants.tsx?examples";
const meta = {
  title: "Motion/Framer Motion variants",
  component: StaggerStudy,
  tags: ["autodocs"],
  play: async ({ canvas }) => {
    await waitFor(
      () =>
        expect(
          canvas.getByRole("button", { name: "Replay animation" }),
        ).toBeEnabled(),
      { timeout: 6000 },
    );
  },
  parameters: {
    docs: {
      description: {
        component:
          "D.G’s marketplace animation variants, adapted to Motion for React. The parent supplies the state and stagger; children inherit it through matching variant names. Replay waits for exit completion before starting again. Every demo uses the current theme and respects reduced motion.",
      },
    },
  },
} satisfies Meta<typeof StaggerStudy>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Stagger: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.StaggerStudy,
        language: "tsx",
        type: "code",
      },
    },
  },
};
const replayStudy: Story = {
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const ready = () =>
      waitFor(
        () =>
          expect(
            canvas.getByRole("button", { name: "Replay animation" }),
          ).toBeEnabled(),
        { timeout: 6000 },
      );
    await ready();
    await step("Hide in reverse order and reveal the collection", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Hide items" }));
      await ready();
      await expect(canvas.getByRole("status")).toHaveTextContent(
        "Items hidden",
      );
      await expect(
        canvas.queryByRole("list", { name: "Animated artwork collection" }),
      ).not.toBeInTheDocument();
      await userEvent.click(canvas.getByRole("button", { name: "Show items" }));
      await ready();
      await expect(canvas.getAllByRole("listitem")).toHaveLength(6);
    });
    await step("Replay a center-out scale sequence", async () => {
      await userEvent.click(canvas.getByRole("combobox", { name: "Timing" }));
      await userEvent.click(
        within(canvasElement.ownerDocument.body).getByRole("option", {
          name: /^Study/,
        }),
      );
      await userEvent.click(
        canvas.getByRole("combobox", { name: "Start from" }),
      );
      await userEvent.click(
        within(canvasElement.ownerDocument.body).getByRole("option", {
          name: "Center outward",
        }),
      );
      await userEvent.click(
        canvas.getByRole("combobox", { name: "Item motion" }),
      );
      await userEvent.click(
        within(canvasElement.ownerDocument.body).getByRole("option", {
          name: "Scale into place",
        }),
      );
      await userEvent.click(
        canvas.getByRole("button", { name: "Replay animation" }),
      );
      await ready();
      await expect(canvas.getByRole("status")).toHaveTextContent(
        "All items visible",
      );
    });
  },
};
export const StudyTiming: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.StaggerStudy,
        language: "tsx",
        type: "code",
      },
    },
  },
  args: { initialTiming: "study" },
  play: replayStudy.play,
};
export const CenterOut: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.StaggerStudy,
        language: "tsx",
        type: "code",
      },
    },
  },
  args: {
    initialTiming: "study",
    initialOrigin: "center",
    initialEffect: "scale",
  },
};
export const ItemEntrances: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.ItemEntranceStudy,
        language: "tsx",
        type: "code",
      },
    },
  },
  render: () => <ItemEntranceStudy />,
};
export const PanelReveal: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.PanelRevealStudy,
        language: "tsx",
        type: "code",
      },
    },
  },
  render: () => <PanelRevealStudy />,
};
export const DelayedPanel: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.PanelRevealStudy,
        language: "tsx",
        type: "code",
      },
    },
  },
  render: () => <PanelRevealStudy preset="delayed" />,
  play: async ({ canvas, userEvent }) => {
    await waitFor(
      () =>
        expect(
          canvas.getByRole("button", { name: "Replay animation" }),
        ).toBeEnabled(),
      { timeout: 6000 },
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Replay animation" }),
    );
    await waitFor(
      () =>
        expect(canvas.getByRole("status")).toHaveTextContent(
          "All items visible",
        ),
      { timeout: 6000 },
    );
    await expect(canvas.getByText("Ready for the campaign")).toBeVisible();
  },
};
export const DetailsPanel: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.PanelRevealStudy,
        language: "tsx",
        type: "code",
      },
    },
  },
  render: () => <PanelRevealStudy preset="details" />,
};
export const SlideFromRight: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.PanelRevealStudy,
        language: "tsx",
        type: "code",
      },
    },
  },
  render: () => <PanelRevealStudy preset="right" />,
};
export const ScaleAndFade: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.ScaleAndFadeStudy,
        language: "tsx",
        type: "code",
      },
    },
  },
  render: () => <ScaleAndFadeStudy />,
};
export const ReducedMotion: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.StaggerStudy,
        language: "tsx",
        type: "code",
      },
    },
  },
  args: { reduceMotion: true },
  play: async ({ canvas, userEvent }) => {
    const ready = () =>
      waitFor(() =>
        expect(
          canvas.getByRole("button", { name: "Replay animation" }),
        ).toBeEnabled(),
      );
    await ready();
    await userEvent.click(canvas.getByRole("button", { name: "Hide items" }));
    await ready();
    await expect(canvas.getByRole("status")).toHaveTextContent("Items hidden");
    await userEvent.click(canvas.getByRole("button", { name: "Show items" }));
    await ready();
    for (const item of canvas.getAllByRole("listitem")) {
      await expect(getComputedStyle(item).transform).toBe("none");
      await expect(getComputedStyle(item).opacity).toBe("1");
    }
  },
};

export const SwitchingEffects: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.StaggerStudy,
        language: "tsx",
        type: "code",
      },
    },
  },
  args: { initialTiming: "original" },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const ready = () =>
      waitFor(
        () =>
          expect(
            canvas.getByRole("button", { name: "Replay animation" }),
          ).toBeEnabled(),
        { timeout: 6000 },
      );
    await ready();
    for (const effect of ["Scale into place", "Drop into place"]) {
      await userEvent.click(canvas.getByRole("button", { name: "Hide items" }));
      await ready();
      await userEvent.click(
        canvas.getByRole("combobox", { name: "Item motion" }),
      );
      await userEvent.click(
        within(canvasElement.ownerDocument.body).getByRole("option", {
          name: effect,
        }),
      );
      await userEvent.click(canvas.getByRole("button", { name: "Show items" }));
      await ready();
      for (const item of canvas.getAllByRole("listitem")) {
        const transform = getComputedStyle(item).transform;
        const matrix =
          transform === "none"
            ? new DOMMatrixReadOnly()
            : new DOMMatrixReadOnly(transform);
        await expect(matrix.m42).toBeCloseTo(0, 2);
        await expect(matrix.m11).toBeCloseTo(1, 2);
      }
    }
  },
};
