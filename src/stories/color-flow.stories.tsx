import type { Meta, StoryContext, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { useArgs } from "storybook/preview-api";
import { ColorFlow, type ColorFlowProps } from "../components/color-flow";
import { ColorFlowDemo } from "../examples/animation-studies";
import storyExamples1 from "../examples/animation-studies.tsx?examples";
async function verifyTiming({
  canvasElement,
  args,
}: StoryContext<ColorFlowProps>) {
  const field = canvasElement.querySelector(".dg-color-field");
  if (!field) throw new Error("Color flow field is missing");
  const animation = getComputedStyle(field);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    await expect(animation.animationName).toBe("none");
  } else {
    await expect(animation.animationDuration).toBe(
      `${Math.max(1000, args.duration ?? 10000) / 1000}s`,
    );
    await expect(animation.animationTimingFunction).toBe(
      args.timingFunction ?? "ease-in-out",
    );
    await expect(animation.animationDirection).toBe("alternate");
  }
}

function InteractiveColorFlow() {
  const [args, updateArgs] = useArgs<ColorFlowProps>();
  return (
    <ColorFlowDemo
      {...args}
      onTimingChange={(duration) => updateArgs({ duration })}
    />
  );
}

const meta = {
  title: "Motion/Color flow",
  component: ColorFlow,
  tags: ["autodocs"],
  play: verifyTiming,
  args: {
    from: "#e0eff5",
    to: "#8deecb",
    foreground: "#153c35",
    duration: 10000,
    timingFunction: "ease-in-out",
    interpolation: "oklch",
    dither: true,
  },
  argTypes: {
    from: { control: "color" },
    to: { control: "color" },
    foreground: { control: "color" },
    timingFunction: {
      control: "select",
      options: ["ease-in-out", "linear", "ease", "ease-in", "ease-out"],
      description:
        "CSS easing for each one-way drift; custom cubic-bezier values also work in code.",
    },
    interpolation: { control: "radio", options: ["oklch", "srgb"] },
    duration: {
      name: "Duration (ms)",
      control: { type: "range", min: 1000, max: 60000, step: 1000 },
      description:
        "Duration of one direction in milliseconds. The animation alternates, so a full round trip takes twice this value.",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A gently shifting color field with configurable duration (milliseconds per direction) and timingFunction (CSS easing). OKLCH interpolation and static monochrome noise soften visible color bands; transform motion avoids animating background-position. Includes a CSS fallback and reduced-motion support. Color depth and display processing can still cause banding.",
      },
    },
  },
} satisfies Meta<typeof ColorFlow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.ColorFlowDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
  render: InteractiveColorFlow,
  play: async (context) => {
    await verifyTiming(context);
    const { canvas, canvasElement, userEvent } = context;
    await userEvent.click(canvas.getByRole("button", { name: "Pause motion" }));
    await expect(
      canvas.getByRole("button", { name: "Resume motion" }),
    ).toHaveAttribute("aria-pressed", "true");
    const field = canvasElement.querySelector(".dg-color-field")!;
    await expect(getComputedStyle(field).animationPlayState).toBe("paused");
    await userEvent.click(canvas.getByRole("button", { name: "Dithering" }));
    await expect(
      canvas.getByRole("button", { name: "Dithering" }),
    ).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(canvas.getByRole("button", { name: "Dithering" }));
    await userEvent.click(
      canvas.getByRole("button", { name: "Resume motion" }),
    );
    await expect(getComputedStyle(field).animationPlayState).toBe("running");
    const initialSeconds = (context.args.duration ?? 10000) / 1000;
    await userEvent.click(
      canvas.getByRole("button", { name: "Decrease duration by one second" }),
    );
    await waitFor(() =>
      expect(getComputedStyle(field).animationDuration).toBe(
        `${initialSeconds - 1}s`,
      ),
    );
    await expect(
      canvas.getByRole("status", { name: "Duration per direction" }),
    ).toHaveTextContent(`${initialSeconds - 1}s each way`);
    await userEvent.click(
      canvas.getByRole("button", { name: "Increase duration by one second" }),
    );
    await waitFor(() =>
      expect(getComputedStyle(field).animationDuration).toBe(
        `${initialSeconds}s`,
      ),
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

export const Miami85: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.ColorFlowDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
  args: {
    from: "#ff8bc8",
    to: "#6ee7e0",
    foreground: "#171226",
    duration: 12000,
  },
  render: InteractiveColorFlow,
};

export const Matrix: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.ColorFlowDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
  args: {
    from: "#06180e",
    to: "#245c38",
    foreground: "#e3fbe9",
    duration: 18000,
    timingFunction: "linear",
  },
  render: InteractiveColorFlow,
};

export const Sunset: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.ColorFlowDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
  args: {
    from: "#ffd08a",
    to: "#f29bb3",
    foreground: "#422138",
    duration: 16000,
  },
  render: InteractiveColorFlow,
};

export const Lavender: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.ColorFlowDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
  args: {
    from: "#ded6ff",
    to: "#f8d7e8",
    foreground: "#35264c",
    duration: 24000,
  },
  render: InteractiveColorFlow,
};

export const Ocean: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.ColorFlowDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
  args: {
    from: "#0b2545",
    to: "#155b68",
    foreground: "#e5faff",
    duration: 20000,
  },
  render: InteractiveColorFlow,
};

export const Complementary: Story = {
  name: "Complementary · Blue and orange",
  args: {
    from: "#70b9f5",
    to: "#ffb45c",
    foreground: "#202038",
    duration: 8000,
  },
  parameters: {
    docs: {
      source: {
        code: storyExamples1.ColorFlowDemo,
        language: "tsx",
        type: "code",
      },
      description: {
        story:
          "Opposing blue and orange hues make the drifting color shift more apparent. Adjust the duration beside the pause button to compare faster and slower motion.",
      },
    },
  },
  render: InteractiveColorFlow,
};
