import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AnimatedCheckbox } from "./animated-checkbox";
import { DotMenuButton } from "./dot-menu-button";
import { WizardSteps, InsetStepper } from "./wizard-steps";
const steps = ["One", "Two", "Three"].map((label) => ({ id: label, label }));
describe("WizardSteps", () => {
  it("marks only preceding steps, including after backward navigation", async () => {
    function Example() {
      const [currentId, onStepChange] = useState("Three");
      return (
        <WizardSteps
          steps={steps}
          currentId={currentId}
          onStepChange={onStepChange}
        />
      );
    }
    render(<Example />);
    expect(
      screen.getByRole("button", { name: "Two" }).closest("li"),
    ).toHaveAttribute("data-complete");
    await userEvent.click(screen.getByRole("button", { name: "One" }));
    expect(
      screen.getByRole("button", { name: "Two" }).closest("li"),
    ).not.toHaveAttribute("data-complete");
    expect(screen.getByRole("button", { name: "One" })).toHaveAttribute(
      "aria-current",
      "step",
    );
  });
});
describe("InsetStepper", () => {
  it("locks future steps and only reports selections of available steps", async () => {
    const change = vi.fn();
    const { rerender } = render(
      <InsetStepper
        steps={steps}
        currentStep={0}
        completedCount={0}
        onStepChange={change}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Two Locked" }));
    expect(change).not.toHaveBeenCalled();
    rerender(
      <InsetStepper
        steps={steps}
        currentStep={1}
        completedCount={1}
        onStepChange={change}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "One Completed" }),
    );
    expect(change).toHaveBeenCalledWith(0);
    expect(screen.getByRole("button", { name: "Three Locked" })).toBeDisabled();
  });
});
describe("AnimatedCheckbox", () => {
  it("submits the native checked value and supports label and keyboard activation", async () => {
    render(
      <form aria-label="Export">
        <AnimatedCheckbox label="Include sources" name="sources" value="yes" />
      </form>,
    );
    const input = screen.getByRole("checkbox");
    const form = screen.getByRole("form") as HTMLFormElement;
    expect(new FormData(form).has("sources")).toBe(false);
    await userEvent.click(screen.getByText("Include sources"));
    expect(input).toBeChecked();
    expect(new FormData(form).get("sources")).toBe("yes");
    await userEvent.keyboard(" ");
    expect(input).not.toBeChecked();
  });
  it("syncs native and accessible indeterminate state when controlled props change", () => {
    const { rerender } = render(
      <AnimatedCheckbox
        label="All"
        checked={false}
        indeterminate
        onChange={() => {}}
      />,
    );
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(input).toBePartiallyChecked();
    rerender(<AnimatedCheckbox label="All" checked onChange={() => {}} />);
    expect(input.indeterminate).toBe(false);
    expect(input).toBeChecked();
    expect(input).not.toHaveAttribute("aria-checked", "mixed");
  });
});
describe("DotMenuButton", () => {
  it("supports keyboard toggling and Escape dismissal", async () => {
    render(<DotMenuButton />);
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
  it("keeps controlled state owned by its parent and honors cancelled clicks", async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <DotMenuButton open={false} onOpenChange={onOpenChange} />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    onOpenChange.mockClear();
    rerender(
      <DotMenuButton
        open={false}
        onOpenChange={onOpenChange}
        onClick={(event) => event.preventDefault()}
      />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
  it("does not activate disabled controls", () => {
    const onOpenChange = vi.fn();
    render(
      <DotMenuButton trigger="hover" disabled onOpenChange={onOpenChange} />,
    );
    fireEvent.pointerEnter(screen.getByRole("button"), {
      pointerType: "mouse",
    });
    fireEvent.click(screen.getByRole("button"));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
