import { expect, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CommerceDemo } from "../examples/marketplace-planned";
import storyExamples1 from "../examples/marketplace-planned.tsx?examples";
const meta = {
  title: "Commerce/Cart",
  component: CommerceDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof CommerceDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.CommerceDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};

export const CheckoutJourney: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.CommerceDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
  play: async ({ canvas, userEvent, step }) => {
    const pacedUser = userEvent.setup({ delay: 50 });
    const pause = () =>
      new Promise<void>((resolve) => setTimeout(resolve, 1000));
    await pause();
    await step("Recalculate the cart", async () => {
      const quantity = canvas.getByRole("spinbutton", {
        name: "Quantity for Art print collection",
      });
      await expect(quantity).toHaveValue(2);
      await pacedUser.type(quantity, "3");
      await expect(
        within(
          canvas.getByRole("article", { name: "Art print collection" }),
        ).getByText("2,875 points"),
      ).toBeVisible();
      await pause();
      await pacedUser.click(canvas.getByRole("button", { name: "Checkout" }));
    });
    await step("Validate contact and shipping details", async () => {
      await pause();
      await pacedUser.click(canvas.getByRole("button", { name: "Continue" }));
      await expect(
        canvas.getByText("Complete your contact and shipping information."),
      ).toBeVisible();
      await pause();
      for (const [name, value] of [
        ["First name", "Maya"],
        ["Last name", "Chen"],
        ["Email address", "maya@example.com"],
        ["Street address", "100 Studio Way"],
        ["City", "Phoenix"],
        ["State / Province", "AZ"],
        ["ZIP / Postal code", "85001"],
      ]) {
        await pacedUser.type(canvas.getByRole("textbox", { name }), value);
      }
      await pause();
      await pacedUser.click(canvas.getByRole("button", { name: "Continue" }));
      await expect(
        canvas.getByRole("heading", { name: "Payment" }),
      ).toBeVisible();
    });
    await step("Review and place the sample order", async () => {
      await pause();
      await pacedUser.click(canvas.getByRole("button", { name: "Continue" }));
      await expect(
        canvas.getByRole("heading", { name: "Review order" }),
      ).toBeVisible();
      await pause();
      await pacedUser.click(
        canvas.getByRole("button", { name: "Place order" }),
      );
      await expect(
        await canvas.findByRole("heading", { name: "Order confirmed" }),
      ).toBeVisible();
    });
  },
};
