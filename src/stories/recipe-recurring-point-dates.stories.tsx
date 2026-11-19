import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormRecurringPointDates } from '../components/form-recipes';
import { savePreview } from '../examples/marketplace-planned';

const meta = {
  title: 'Forms/Recipes/Recurring Point Dates',
  component: FormRecurringPointDates,
  tags: ['autodocs'],
  args: { onSubmit: savePreview },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormRecurringPointDates>;

export default meta;
export const Default: StoryObj<typeof meta> = {};

export const SaveFailure: StoryObj<typeof meta> = {
  args: {
    onSubmit: async () => {
      throw new Error('Unable to save. Please try again.');
    },
  },
};
