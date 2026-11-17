import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormEmployeeOnboarding } from "../components/form-recipes";
import { savePreview } from "../examples/marketplace-planned";
const meta = {
  title: "Forms/Recipes/Employee Onboarding",
  component: FormEmployeeOnboarding,
  tags: ["autodocs"],
  args: { onSubmit: savePreview },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormEmployeeOnboarding>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
export const SaveFailure: StoryObj<typeof meta> = {
  args: {
    onSubmit: async () => {
      throw new Error("Unable to save. Please try again.");
    },
  },
};
