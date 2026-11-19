import type { Meta, StoryObj } from "@storybook/react-vite";
import { DrawerDemo } from "../examples/marketplace-partials";
import storyExamples1 from "../examples/marketplace-partials.tsx?examples";
const meta = {
  title: "Overlays/Settings drawer",
  component: DrawerDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof DrawerDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.DrawerDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};
