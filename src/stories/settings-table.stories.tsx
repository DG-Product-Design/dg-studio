import type { Meta, StoryObj } from "@storybook/react-vite";
import { SettingsTable } from "../components/account-components";

const meta = {
  title: "Content/Settings table",
  component: SettingsTable,
  tags: ["autodocs"],
  args: {
    rows: [
      { id: "workspace", label: "Workspace", value: "D.G Studio" },
      { id: "plan", label: "Plan", value: "Studio" },
      { id: "members", label: "Members", value: 0 },
    ],
  },
} satisfies Meta<typeof SettingsTable>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
