import { describe, expect, it } from "vitest";
import { parseEmployeeCsv } from "./employee-import";

const header = "firstName,lastName,email";
describe("parseEmployeeCsv", () => {
  it("preserves quoted commas, escaped quotes and embedded newlines with a BOM and CRLF", () => {
    const result = parseEmployeeCsv(
      '\uFEFFfirstName,lastName,email,department,employeeId\r\n"Maya, Jean","O""Brien",maya@example.com,"Design\r\nStudio",0042\r\n',
    );
    expect(result.errors).toEqual([]);
    expect(result.records).toEqual([
      {
        firstName: "Maya, Jean",
        lastName: 'O"Brien',
        email: "maya@example.com",
        department: "Design\r\nStudio",
        employeeId: "0042",
      },
    ]);
  });
  it("ignores blank rows and reports unknown columns without forwarding their data", () => {
    const result = parseEmployeeCsv(
      `${header},secret\n\nMaya,Chen,maya@example.com,private\n,,,\n`,
    );
    expect(result.errors).toEqual([]);
    expect(result.records).toHaveLength(1);
    expect(result.records[0]).not.toHaveProperty("secret");
    expect(result.warnings).toEqual(["Column “secret” will be ignored."]);
  });
  it.each([
    ["", "Missing column: firstName", 1],
    [header, "Add at least one employee row.", 2],
    [
      `${header},email\nMaya,Chen,a@example.com,a@example.com`,
      "Column names must be unique.",
      1,
    ],
    [`${header}\nMaya,Chen`, "Column count does not match the header.", 2],
    [`${header}\nMaya,Chen,not-an-email`, "Email address is invalid.", 2],
    [`${header}\n,Chen,maya@example.com`, "firstName is required.", 2],
    [
      `${header}\nMaya,Chen,maya@example.com\nSam,Rivera,MAYA@example.com`,
      "Duplicate email address.",
      3,
    ],
    [
      `${header}\n"Maya,Chen,maya@example.com`,
      "A quoted field is not closed.",
      2,
    ],
    [
      `${header}\n"Maya"x,Chen,maya@example.com`,
      "Unexpected text after a quoted field.",
      2,
    ],
  ])("reports invalid CSV with a row number: %s", (csv, message, row) => {
    expect(parseEmployeeCsv(csv).errors).toContainEqual({ row, message });
  });
});
