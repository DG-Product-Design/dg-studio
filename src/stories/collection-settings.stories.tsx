import type { Meta, StoryObj } from "@storybook/react-vite";
import { CollectionSettings } from "../examples/collection-settings";
import storyExamples1 from "../examples/collection-settings.tsx?examples";
const meta = {
  title: "Examples/Collection settings",
  component: CollectionSettings,
  tags: ["autodocs"],
} satisfies Meta<typeof CollectionSettings>;
export default meta;
export const Default: StoryObj<typeof CollectionSettings> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.CollectionSettings,
        language: "tsx",
        type: "code",
      },
    },
  },
};
