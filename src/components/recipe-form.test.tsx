import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Form, type RecipeField } from "./recipe-form";
import { deferred } from "../test/deferred";

describe("Form", () => {
  it("blocks invalid fields and focuses the first invalid control", async () => {
    const onSubmit = vi.fn();
    render(
      <Form
        title="Contact"
        fields={[
          { name: "email", label: "Email", type: "email", required: true },
        ]}
        onSubmit={onSubmit}
      />,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(screen.getByLabelText("Email")).toHaveFocus());
    expect(onSubmit).not.toHaveBeenCalled();
    await user.type(screen.getByLabelText("Email"), "invalid");
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it("submits numeric zero and excludes hidden fields from validation and payload", async () => {
    const onSubmit = vi.fn();
    const fields: RecipeField[] = [
      {
        name: "points",
        label: "Points",
        type: "number",
        min: 0,
        required: true,
      },
      { name: "secret", label: "Hidden", required: true, when: () => false },
    ];
    render(
      <Form
        title="Balance"
        fields={fields}
        defaultValues={{ points: 0, secret: "Old hidden value" }}
        onSubmit={onSubmit}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(onSubmit).toHaveBeenCalledExactlyOnceWith({ points: 0 });
    expect(screen.queryByLabelText("Hidden")).not.toBeInTheDocument();
  });
  it("locks pending submissions, retains input on failure, and allows retry", async () => {
    const pending = deferred();
    const onSubmit = vi
      .fn()
      .mockReturnValueOnce(pending.promise)
      .mockResolvedValue(undefined);
    render(
      <Form
        title="Collection"
        fields={[{ name: "name", label: "Name" }]}
        defaultValues={{ name: "Dusk" }}
        onSubmit={onSubmit}
      />,
    );
    const button = screen.getByRole("button", { name: "Save changes" });
    const form = button.closest("form")!;
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText("Name")).toBeDisabled();
    await act(async () => pending.reject(new Error("Connection lost")));
    expect(screen.getByText("Connection lost")).toBeVisible();
    expect(screen.getByLabelText("Name")).toHaveValue("Dusk");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(await screen.findByText("Changes saved.")).toBeVisible();
    expect(onSubmit).toHaveBeenCalledTimes(2);
  });
  it("runs cross-field validation before invoking the host callback", async () => {
    const onSubmit = vi.fn();
    render(
      <Form
        title="Transfer"
        fields={[{ name: "to", label: "Destination" }]}
        validate={() => ({ to: "Choose another account." })}
        onSubmit={onSubmit}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByLabelText("Destination")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
