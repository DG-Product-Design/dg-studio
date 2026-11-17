import { expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchSelectionDemo } from "../examples/marketplace-partials";
const meta = {
  title: "Forms/Search select",
  component: SearchSelectionDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof SearchSelectionDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};

export const SearchSelectAndCreate: StoryObj<typeof meta> = {
  play: async ({ canvas, userEvent, step }) => {
    const search = canvas.getByRole("combobox", { name: "Accounts" });
    await step("Find and select an account with the keyboard", async () => {
      await userEvent.type(search, "studio");
      await canvas.findByRole("option", { name: /Studio account/ });
      await userEvent.keyboard("{ArrowDown}{Enter}");
      await expect(
        canvas.getByRole("button", { name: "Remove Studio account" }),
      ).toBeVisible();
    });
    await step("Recover from a failed search", async () => {
      await userEvent.type(search, "error");
      await expect(
        await canvas.findByText(
          "Account search unavailable. Try another search.",
        ),
      ).toBeVisible();
      await userEvent.clear(search);
      await userEvent.type(search, "New account");
      await canvas.findByText("No matching options");
      await userEvent.click(
        canvas.getByRole("button", { name: "Create “New account”" }),
      );
      await expect(
        await canvas.findByRole("button", { name: "Remove New account" }),
      ).toBeVisible();
      await userEvent.keyboard("{Escape}");
    });
    await step("Remove a selected account", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Remove Studio account" }),
      );
      await expect(
        canvas.queryByRole("button", { name: "Remove Studio account" }),
      ).not.toBeInTheDocument();
    });
  },
};
