import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "../components/navigation";
const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;
export default meta;
export const Default: StoryObj<typeof Pagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <div className="max-w-xl">
        <Pagination page={page} pageCount={12} onPageChange={setPage} />
      </div>
    );
  },
};
