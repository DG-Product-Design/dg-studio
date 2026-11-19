import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { AnimatedCheckbox } from "../components/animated-checkbox";
import { CheckboxSelectionDemo } from "../examples/animation-studies";
import storyExamples1 from "../examples/animation-studies.tsx?examples";
const meta = {
  title: "Forms/Animated checkbox",
  component: AnimatedCheckbox,
  tags: ["autodocs"],
  args: { label: "Include original source files" },
  parameters: {
    docs: {
      description: {
        component:
          "A native checkbox with an orange interaction halo and animated SVG check/minus marks. Supports checked, indeterminate, disabled, keyboard, and native forms.",
      },
    },
  },
} satisfies Meta<typeof AnimatedCheckbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const FileSelection: Story = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.CheckboxSelectionDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
  render: () => <CheckboxSelectionDemo />,
  play: async ({ canvas, userEvent }) => {
    const all = canvas.getByRole("checkbox", { name: "Select all files" });
    await expect(all).toBePartiallyChecked();
    await userEvent.click(all);
    await expect(all).toBeChecked();
    await expect(canvas.getByRole("status")).toHaveTextContent("3 of 3");
    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Social crops" }),
    );
    await expect(all).toBePartiallyChecked();
    await expect(
      canvas.getByRole("checkbox", { name: /Archived versions/ }),
    ).toBeDisabled();
    await userEvent.click(all);
    await userEvent.keyboard(" ");
    await expect(canvas.getByRole("status")).toHaveTextContent("0 of 3");
  },
};
