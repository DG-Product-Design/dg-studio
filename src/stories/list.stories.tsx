import type { Meta, StoryObj } from "@storybook/react-vite";
import { List } from "../components/foundation-primitives";

const meta = {
  title: "Content/List",
  component: List,
  tags: ["autodocs"],
  args: {
    children: (
      <>
        <li>Choose a collection</li>
        <li>Review the artwork</li>
        <li>Share the result</li>
      </>
    ),
    ordered: true,
  },
} satisfies Meta<typeof List>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
