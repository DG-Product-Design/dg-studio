import type { ReactNode } from "react";
import {
  Form,
  passwordValidation,
  type FormProps,
  type RecipeField,
  type FormValues,
} from "./recipe-form";
import type { SelectOption } from "./fields";
const accountOptions: SelectOption[] = [
  { value: "studio", label: "Studio account" },
  { value: "team", label: "Team account" },
];
const programOptions: SelectOption[] = [
  { value: "welcome", label: "Welcome program" },
  { value: "recognition", label: "Recognition program" },
];
const recipients: SelectOption[] = [
  { value: "maya", label: "Maya Chen" },
  { value: "sam", label: "Sam Rivera" },
];
const email: RecipeField = {
  name: "email",
  label: "Email address",
  type: "email",
  required: true,
  autoComplete: "email",
};
const password: RecipeField = {
  name: "password",
  label: "Password",
  type: "password",
  required: true,
  autoComplete: "new-password",
  validate: passwordValidation,
};
const confirmation: RecipeField = {
  name: "confirmation",
  label: "Confirm password",
  type: "password",
  required: true,
  autoComplete: "new-password",
  validate: (v, values) =>
    v === (values.newPassword ?? values.password)
      ? undefined
      : "Passwords must match.",
};
const amount: RecipeField = {
  name: "amount",
  label: "Amount in points",
  type: "number",
  required: true,
  min: 1,
};
const message: RecipeField = {
  name: "message",
  label: "Message",
  type: "textarea",
};
const account: RecipeField = {
  name: "account",
  label: "Point account",
  type: "select",
  options: accountOptions,
  required: true,
};
const firstName: RecipeField = {
  name: "firstName",
  label: "First name",
  required: true,
  autoComplete: "given-name",
};
const lastName: RecipeField = {
  name: "lastName",
  label: "Last name",
  required: true,
  autoComplete: "family-name",
};
const dateRange: RecipeField[] = [
  { name: "startDate", label: "Start date", type: "date", required: true },
  {
    name: "endDate",
    label: "End date",
    type: "date",
    validate: (v, values) =>
      v && String(v) < String(values.startDate)
        ? "End date must follow the start date."
        : undefined,
  },
];
export interface RecipeProps {
  onSubmit: FormProps["onSubmit"];
  onCancel?: () => void;
  defaultValues?: FormValues;
  options?: Record<string, SelectOption[]>;
  children?: ReactNode;
  footer?: ReactNode;
  validate?: FormProps["validate"];
  maxAmount?: number;
}
function recipe(title: string, submitLabel: string, fields: RecipeField[]) {
  function Recipe({ options, maxAmount, ...props }: RecipeProps) {
    return (
      <Form
        {...props}
        title={title}
        submitLabel={submitLabel}
        fields={fields.map((f) => ({
          ...f,
          options: options?.[f.name] ?? f.options,
          max: f.name === "amount" ? maxAmount : f.max,
        }))}
      />
    );
  }
  Recipe.displayName = title;
  return Recipe;
}
export const FormLogin = recipe("Log in", "Log in", [
  email,
  { ...password, autoComplete: "current-password", validate: undefined },
  { name: "remember", label: "Remember this device", type: "checkbox" },
]);
export const FormSignUp = recipe("Create an account", "Create account", [
  email,
  password,
  confirmation,
]);
export const FormForgotPassword = recipe(
  "Reset your password",
  "Send reset email",
  [email],
);
export const FormResetPassword = recipe("Set a new password", "Set password", [
  password,
  confirmation,
]);
export const FormUpdatePassword = recipe("Update password", "Update password", [
  {
    ...password,
    name: "currentPassword",
    label: "Current password",
    autoComplete: "current-password",
    validate: undefined,
  },
  { ...password, name: "newPassword", label: "New password" },
  confirmation,
]);
export const FormBasicInfo = recipe("Basic information", "Save information", [
  firstName,
  lastName,
  email,
  { ...email, name: "recoveryEmail", label: "Recovery email", required: false },
  { name: "phone", label: "Mobile", type: "tel" },
  {
    name: "primaryIsPersonal",
    label: "My primary email is personal",
    type: "checkbox",
  },
]);
export const FormAlternateEmail = recipe("Alternate email", "Update email", [
  email,
  {
    name: "primaryIsPersonal",
    label: "Use this as my personal email",
    type: "checkbox",
  },
]);
export const FormEmployeeOnboarding = recipe(
  "Employee onboarding",
  "Save onboarding",
  [
    { name: "launchDate", label: "Launch date", type: "date", required: true },
    { name: "time", label: "Launch time", type: "time", required: true },
    { name: "employeeId", label: "Employee ID" },
    { name: "department", label: "Department" },
    { name: "birthDate", label: "Date of birth", type: "date" },
    { name: "hireDate", label: "Hire date", type: "date" },
  ],
);
export const FormSMS = recipe("Text notifications", "Enable notifications", [
  { name: "mobile", label: "Mobile number", type: "tel", required: true },
  {
    name: "consent",
    label: "I agree to receive account notifications by text",
    type: "checkbox",
    required: true,
  },
]);
export const FormCreatePointAccount = recipe(
  "Create point account",
  "Create account",
  [
    { name: "accountName", label: "Account name", required: true },
    {
      name: "assignee",
      label: "Account owner",
      type: "select",
      options: recipients,
      required: true,
    },
  ],
);
export const FormCreateProgram = recipe("Create a program", "Create program", [
  { name: "programName", label: "Program name", required: true },
  {
    name: "programType",
    label: "Program type",
    type: "radio",
    required: true,
    options: [
      { value: "launch", label: "Launch" },
      { value: "event", label: "Event" },
      { value: "custom-date", label: "Recurring date" },
    ],
  },
]);
export const FormAddToPrograms = recipe("Add to programs", "Add to programs", [
  {
    name: "programs",
    label: "Select programs",
    type: "multi",
    options: programOptions,
    required: true,
  },
]);
export const FormDistributionAccount = recipe(
  "Distribution account",
  "Save account",
  [{ ...account, type: "radio" }],
);
export const FormAddPoints = recipe("Add points", "Add points", [
  account,
  amount,
  {
    name: "payment",
    label: "Payment method",
    type: "select",
    options: [
      { value: "card", label: "Visa ending 4242" },
      { value: "invoice", label: "Invoice" },
    ],
    required: true,
  },
]);
export const FormProgramAddPoints = recipe("Program points", "Review points", [
  amount,
  message,
  {
    name: "autoEnroll",
    label: "Automatically enroll new employees",
    type: "checkbox",
  },
]);
export const FormTransferPoints = recipe("Transfer points", "Transfer points", [
  amount,
  { ...account, name: "from", label: "From account" },
  {
    ...account,
    name: "to",
    label: "To account",
    validate: (v, values) =>
      v === values.from ? "Choose a different destination account." : undefined,
  },
]);
export const FormSendPoints = recipe("Send points", "Send points", [
  {
    name: "recipients",
    label: "Recipients",
    type: "multi",
    options: recipients,
    required: true,
  },
  amount,
  message,
  { name: "date", label: "Send date", type: "date", required: true },
  { name: "time", label: "Send time", type: "time", required: true },
  {
    name: "tags",
    label: "Tags",
    type: "multi",
    options: [
      { value: "courage", label: "Courage" },
      { value: "teamwork", label: "Teamwork" },
    ],
  },
  {
    name: "channel",
    label: "Share to channel",
    type: "select",
    options: [
      { value: "private", label: "Private" },
      { value: "team", label: "Team" },
    ],
  },
]);
export const FormRecurringPointDates = recipe(
  "Recurring point dates",
  "Save schedule",
  [
    {
      name: "schedule",
      label: "Schedule type",
      type: "radio",
      required: true,
      options: [
        { value: "custom", label: "Custom date" },
        { value: "event", label: "Employee event" },
      ],
    },
    {
      name: "months",
      label: "Recurring months",
      type: "multi",
      required: true,
      options: Array.from({ length: 12 }, (_, i) => ({
        value: String(i + 1),
        label: new Intl.DateTimeFormat("en", {
          month: "long",
          timeZone: "UTC",
        }).format(new Date(Date.UTC(2026, i, 1))),
      })),
      when: (v) => v.schedule === "custom",
    },
    {
      name: "day",
      label: "Recurring day",
      type: "number",
      required: true,
      min: 1,
      max: 28,
      hint: "Choose days 1–28 for a date that exists in every month.",
      when: (v) => v.schedule === "custom",
    },
    {
      name: "event",
      label: "Employee event",
      type: "select",
      required: true,
      options: [
        { value: "birthday", label: "Birthday" },
        { value: "anniversary", label: "Work anniversary" },
      ],
      when: (v) => v.schedule === "event",
    },
    ...dateRange,
  ],
);
export const FormVendorDiscountsInfo = recipe(
  "Vendor discounts",
  "Save discounts",
  [
    {
      name: "percentage",
      label: "Discount percentage",
      type: "number",
      required: true,
      min: 0,
      max: 100,
    },
    {
      name: "vendors",
      label: "Vendors",
      type: "multi",
      required: true,
      options: [
        { value: "outdoors", label: "Outdoors" },
        { value: "learning", label: "Learning" },
      ],
    },
    message,
  ],
);
