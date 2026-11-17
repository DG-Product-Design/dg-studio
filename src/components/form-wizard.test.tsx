import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useWizardDraft } from "./form-wizard";

const initial = { name: "" };
const valid = (value: unknown): value is typeof initial =>
  !!value &&
  typeof value === "object" &&
  "name" in value &&
  typeof value.name === "string";
describe("useWizardDraft", () => {
  it("restores validated drafts and persists subsequent edits", () => {
    localStorage.setItem("draft", JSON.stringify({ name: "Saved" }));
    const { result } = renderHook(() =>
      useWizardDraft("draft", initial, valid),
    );
    expect(result.current.value).toEqual({ name: "Saved" });
    act(() => result.current.setValue({ name: "Updated" }));
    expect(JSON.parse(localStorage.getItem("draft")!)).toEqual({
      name: "Updated",
    });
  });
  it("rejects data that no longer matches the draft schema", () => {
    localStorage.setItem("draft", JSON.stringify({ name: 42 }));
    const { result } = renderHook(() =>
      useWizardDraft("draft", initial, valid),
    );
    expect(result.current.value).toEqual(initial);
  });
  it("changes keys without overwriting another draft with the previous value", () => {
    localStorage.setItem("a", JSON.stringify({ name: "First" }));
    localStorage.setItem("b", JSON.stringify({ name: "Second" }));
    const { result, rerender } = renderHook(
      ({ key }) => useWizardDraft(key, initial, valid),
      { initialProps: { key: "a" } },
    );
    rerender({ key: "b" });
    expect(result.current.value).toEqual({ name: "Second" });
    expect(JSON.parse(localStorage.getItem("a")!)).toEqual({ name: "First" });
    expect(JSON.parse(localStorage.getItem("b")!)).toEqual({ name: "Second" });
  });
  it("clears a draft without immediately recreating it, and saves the next edit", () => {
    const { result, rerender } = renderHook(() =>
      useWizardDraft("draft", initial, valid),
    );
    act(() => result.current.setValue({ name: "Edited" }));
    act(() => result.current.clear());
    rerender();
    expect(result.current.value).toEqual(initial);
    expect(localStorage.getItem("draft")).toBeNull();
    act(() => result.current.setValue({ name: "New" }));
    expect(JSON.parse(localStorage.getItem("draft")!)).toEqual({ name: "New" });
  });
  it("keeps the form usable when storage cannot be read or written", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Denied");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Quota");
    });
    const { result } = renderHook(() =>
      useWizardDraft("draft", initial, valid),
    );
    act(() => result.current.setValue({ name: "Still editable" }));
    expect(result.current.value.name).toBe("Still editable");
    expect(result.current.storageError).toMatch(/could not be saved/);
  });
  it("recovers safely from malformed JSON", () => {
    localStorage.setItem("draft", "{broken");
    const { result } = renderHook(() =>
      useWizardDraft("draft", initial, valid),
    );
    expect(result.current.value).toEqual(initial);
    expect(result.current.storageError).toMatch(/unavailable/);
  });
});
