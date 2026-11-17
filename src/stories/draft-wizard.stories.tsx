import type { Meta, StoryObj } from "@storybook/react-vite";
import { DraftWizardDemo } from "../examples/marketplace-partials";
const meta = {
  title: "Forms/Draft wizard",
  component: DraftWizardDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof DraftWizardDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
