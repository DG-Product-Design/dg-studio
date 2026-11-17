import type { Meta, StoryObj } from "@storybook/react-vite";
import { Coin } from "../components/coin";

const meta = {
  title: "Content/Coin",
  component: Coin,
  tags: ["autodocs"],
  args: { size: 48 },
} satisfies Meta<typeof Coin>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
