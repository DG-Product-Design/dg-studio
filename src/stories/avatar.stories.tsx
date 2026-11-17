import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Stack } from "../components/content";
const meta = {
  title: "Content/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: { name: "David George" },
} satisfies Meta<typeof Avatar>;
export default meta;
export const Initials: StoryObj<typeof Avatar> = {};
export const Image: StoryObj<typeof Avatar> = {
  args: { src: "/images/welcome.jpg" },
};
export const FailedImage: StoryObj<typeof Avatar> = {
  args: { src: "/images/missing-avatar.jpg" },
};
export const Sizes: StoryObj<typeof Avatar> = {
  render: () => (
    <Stack direction="horizontal">
      <Avatar name="David George" size="sm" />
      <Avatar name="David George" />
      <Avatar name="David George" size="lg" />
    </Stack>
  ),
};
