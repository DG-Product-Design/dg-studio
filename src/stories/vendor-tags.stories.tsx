import type { Meta, StoryObj } from "@storybook/react-vite";
import { VendorTagsDemo } from "../examples/marketplace-partials";
import storyExamples1 from "../examples/marketplace-partials.tsx?examples";
const meta = {
  title: "Content/Vendor tags",
  component: VendorTagsDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof VendorTagsDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.VendorTagsDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};
