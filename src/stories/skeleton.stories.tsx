import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "../components/feedback";
const meta = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;
export default meta;
export const ImageCard: StoryObj<typeof Skeleton> = {
  render: () => (
    <div
      role="status"
      aria-label="Loading image cards"
      className="max-w-sm rounded-xl border bg-card p-3"
    >
      <Skeleton className="aspect-[4/3] w-full" />
      <Skeleton className="mt-5 h-4 w-2/3" />
      <Skeleton className="mt-3 mb-3 h-3 w-1/2" />
    </div>
  ),
};
