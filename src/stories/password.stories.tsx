import { expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordDemo } from "../examples/marketplace-planned";
const meta = {
  title: "Forms/Password",
  component: PasswordDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof PasswordDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};

export const RevealAndHide: StoryObj<typeof meta> = {
  play: async ({ canvas, userEvent }) => {
    const password = canvas.getByLabelText("New password", { exact: true });
    await userEvent.type(password, "AstrongSecret123");
    await expect(password).toHaveAttribute("type", "password");
    await userEvent.click(
      canvas.getByRole("button", { name: "Show password" }),
    );
    await expect(password).toHaveAttribute("type", "text");
    await expect(password).toHaveValue("AstrongSecret123");
    await userEvent.click(
      canvas.getByRole("button", { name: "Hide password" }),
    );
    await expect(password).toHaveAttribute("type", "password");
    await expect(
      canvas.getByRole("list", { name: "Password requirements" }),
    ).not.toHaveTextContent("not met");
  },
};
