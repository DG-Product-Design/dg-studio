import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "../components/navigation";
const meta = {
  title: "Navigation/Stepper",
  component: Stepper,
  tags: ["autodocs"],
} satisfies Meta<typeof Stepper>;
export default meta;
export const Default: StoryObj<typeof Stepper> = {
  args: {
    steps: [
      { id: "details", label: "Details" },
      { id: "settings", label: "Settings" },
      { id: "review", label: "Review" },
    ],
    currentStep: 1,
  },
};
