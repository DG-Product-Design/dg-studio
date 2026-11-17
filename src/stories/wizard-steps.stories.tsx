import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { ArrowWizardDemo } from "../examples/animation-studies";
const meta = {
  title: "Navigation/Wizard steps",
  component: ArrowWizardDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Selectable arrow steps with a clear progress track. Every preceding step gets an orange bottom border. Selection does not imply validation.",
      },
    },
  },
  argTypes: { completedColor: { control: "color" } },
  render: (args) => <ArrowWizardDemo completedColor={args.completedColor} />,
} satisfies Meta<typeof ArrowWizardDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Selectable: Story = {
  play: async ({ canvas, userEvent, step }) => {
    await step("Jump forward and mark all earlier steps", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Dependents" }));
      await expect(
        canvas.getByRole("button", { name: "Dependents" }),
      ).toHaveAttribute("aria-current", "step");
      for (const name of ["Identity", "Contact", "Employment"])
        await expect(
          canvas.getByRole("button", { name }).closest("li"),
        ).toHaveAttribute("data-complete");
    });
    await step("Jump backward and remove later completion tracks", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Contact" }));
      await expect(
        canvas.getByRole("button", { name: "Employment" }).closest("li"),
      ).not.toHaveAttribute("data-complete");
      await expect(
        canvas.getByRole("heading", { name: "Contact" }),
      ).toBeVisible();
    });
  },
};
export const Mobile: Story = {
  render: (args) => (
    <div style={{ width: 390, maxWidth: "100%" }}>
      <ArrowWizardDemo {...args} />
    </div>
  ),
};
