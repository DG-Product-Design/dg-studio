import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardNextButton } from "../components/foundation-primitives";

const meta = {
  title: "Navigation/Card next button",
  component: CardNextButton,
  tags: ["autodocs"],
  args: {
    title: "Explore the library",
    description: "See every marketplace source component.",
    onClick: () => {
      location.href = "./?path=/story/source-catalog-marketplace--inventory";
    },
  },
} satisfies Meta<typeof CardNextButton>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
