import { describe, expect, it } from "vitest";
import {
  createTableCsv,
  matchesTableFilters,
  type TableFilterValue,
} from "./table-tools";

describe("createTableCsv", () => {
  it("escapes quotes, commas and newlines, retaining zero and empty cells", () => {
    expect(
      createTableCsv(
        ["Name", "Points", "Note"],
        [
          ['Maya, "Jean"', 0, "line one\nline two"],
          [null, -10, undefined],
        ],
      ),
    ).toBe(
      '"Name","Points","Note"\r\n"Maya, ""Jean""","0","line one\nline two"\r\n"","-10",""',
    );
  });
  it.each(["=SUM(A1:A2)", "+123", "@SUM(A1)", "-10", " \t=1+1", "\n+1"])(
    "neutralizes spreadsheet formulas in strings: %s",
    (input) => {
      expect(createTableCsv([input], [[input]])).toBe(
        `"'${input}"\r\n"'${input}"`,
      );
    },
  );
});
describe("matchesTableFilters", () => {
  const row = {
    name: "Dusk study",
    state: "ready",
    created: "2026-11-16T18:00:00Z",
  };
  it.each<[Record<string, TableFilterValue>, boolean]>([
    [{}, true],
    [{ name: "DUSK" }, true],
    [{ name: "dawn" }, false],
    [{ state: [] }, true],
    [{ state: ["ready", "draft"] }, true],
    [{ state: ["draft"] }, false],
    [{ created: { from: "2026-11-16", to: "2026-11-16" } }, true],
    [{ created: { from: "2026-11-17", to: "" } }, false],
    [{ created: { from: "", to: "2026-11-15" } }, false],
    [{ name: "dusk", state: ["draft"] }, false],
  ])(
    "combines text, choices, and inclusive date bounds: %j",
    (filters, result) => {
      expect(matchesTableFilters(row, filters)).toBe(result);
    },
  );
  it("excludes missing and invalid dates when a bound is active", () => {
    const filters = { created: { from: "2026-11-01", to: "" } };
    expect(matchesTableFilters({}, filters)).toBe(false);
    expect(matchesTableFilters({ created: "not a date" }, filters)).toBe(false);
    expect(matchesTableFilters({}, { created: { from: "", to: "" } })).toBe(
      true,
    );
  });
});
