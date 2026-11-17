import { expect } from "storybook/test";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormWizard } from "../components/form-wizard";
import { TextField } from "../components/fields";
const meta = {
  title: "Forms/Form wizard",
  component: FormWizard,
  tags: ["autodocs"],
} satisfies Meta<typeof FormWizard>;
export default meta;
export const Default: StoryObj<typeof FormWizard> = {
  render: () => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);
    return done ? (
      <p role="status">Collection saved.</p>
    ) : (
      <div className="max-w-xl">
        <FormWizard
          onComplete={() => setDone(true)}
          finishLabel="Save collection"
          steps={[
            {
              id: "name",
              label: "Name",
              validate: () => {
                setError(name.trim() ? "" : "Enter a name.");
                return !!name.trim();
              },
              content: (
                <TextField
                  label="Collection name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={error}
                />
              ),
            },
            { id: "review", label: "Review", content: <p>{name}</p> },
          ]}
        />
      </div>
    );
  },
};
export const SaveFailure: StoryObj<typeof FormWizard> = {
  args: {
    steps: [
      {
        id: "review",
        label: "Review",
        content: <p>Summer campaign is ready.</p>,
      },
    ],
    onComplete: async () => {
      throw new Error("Connection interrupted. Your changes are still here.");
    },
    finishLabel: "Save collection",
  },
};

export const ValidationAndSave: StoryObj<typeof FormWizard> = {
  ...Default,
  play: async ({ canvas, userEvent, step }) => {
    await step("Require a collection name", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
      await expect(canvas.getByLabelText("Collection name")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });
    await step("Review and save", async () => {
      await userEvent.type(
        canvas.getByLabelText("Collection name"),
        "Summer campaign",
      );
      await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
      await expect(
        canvas.getByRole("heading", { name: "Review" }),
      ).toHaveFocus();
      await expect(canvas.getByText("Summer campaign")).toBeVisible();
      await userEvent.click(
        canvas.getByRole("button", { name: "Save collection" }),
      );
      await expect(await canvas.findByRole("status")).toHaveTextContent(
        "Collection saved.",
      );
    });
  },
};
export const FailedSaveKeepsReview: StoryObj<typeof FormWizard> = {
  ...SaveFailure,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Save collection" }),
    );
    await expect(
      await canvas.findByText(
        "Connection interrupted. Your changes are still here.",
      ),
    ).toBeVisible();
    await expect(canvas.getByText("Summer campaign is ready.")).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Save collection" }),
    ).toBeEnabled();
  },
};
