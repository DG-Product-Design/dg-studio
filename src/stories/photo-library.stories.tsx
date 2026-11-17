import type { Meta, StoryObj } from "@storybook/react-vite";
import { PhotoLibrary } from "../components/media";
import { assets } from "../examples/assets";
const meta = {
  title: "Media/Photo library",
  component: PhotoLibrary,
  tags: ["autodocs"],
  args: { images: assets },
} satisfies Meta<typeof PhotoLibrary>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = { args: { images: [] } };
