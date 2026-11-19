import { expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CsvImportDemo } from "../examples/marketplace-planned";
import storyExamples1 from "../examples/marketplace-planned.tsx?examples";
const meta = {
  title: "Forms/Employee CSV import",
  component: CsvImportDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof CsvImportDemo>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.CsvImportDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
};

export const ValidateAndImport: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.CsvImportDemo,
        language: "tsx",
        type: "code",
      },
    },
  },
  play: async ({ canvas, userEvent, step }) => {
    await step("Block duplicate email addresses", async () => {
      await userEvent.upload(
        canvas.getByLabelText("Employee CSV"),
        new File(
          [
            "firstName,lastName,email\nMaya,Chen,maya@example.com\nSam,Rivera,maya@example.com",
          ],
          "invalid.csv",
          { type: "text/csv" },
        ),
      );
      await expect(
        await canvas.findByText("Row 3: Duplicate email address."),
      ).toBeVisible();
      await expect(
        canvas.getByRole("button", { name: "Import employees" }),
      ).toBeDisabled();
    });
    await step("Review and import corrected data", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Choose another file" }),
      );
      await userEvent.upload(
        canvas.getByLabelText("Employee CSV"),
        new File(
          ['firstName,lastName,email\r\n"Maya, Jean",Chen,maya@example.com'],
          "employees.csv",
          { type: "text/csv" },
        ),
      );
      await expect(
        await canvas.findByRole("cell", { name: "Maya, Jean Chen" }),
      ).toBeVisible();
      await userEvent.click(
        canvas.getByRole("button", { name: "Import employees" }),
      );
      await expect(await canvas.findByText("Employees imported")).toBeVisible();
    });
  },
};
