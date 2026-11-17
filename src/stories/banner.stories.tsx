import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Banner } from "../components/feedback";
const meta = {
  title: "Feedback/Banner",
  component: Banner,
  tags: ["autodocs"],
  args: {
    title: "A newer draft is available",
    children:
      "Your current work is saved. Review the latest version when you’re ready.",
    className: "max-w-2xl",
  },
} satisfies Meta<typeof Banner>;
export default meta;
export const Info: StoryObj<typeof Banner> = {};
export const Success: StoryObj<typeof Banner> = {
  args: { tone: "success", title: "Your collection is ready" },
};
export const Warning: StoryObj<typeof Banner> = {
  args: { tone: "warning", title: "Some images need a larger source" },
};
export const Danger: StoryObj<typeof Banner> = {
  args: { tone: "danger", title: "The upload did not finish" },
};
export const Dismissible: StoryObj<typeof Banner> = {
  render: () => {
    const [show, setShow] = useState(true);
    return show ? (
      <Banner
        title="A newer draft is available"
        onDismiss={() => setShow(false)}
      >
        Review the latest version when you’re ready.
      </Banner>
    ) : (
      <p role="status">Notice dismissed.</p>
    );
  },
};
