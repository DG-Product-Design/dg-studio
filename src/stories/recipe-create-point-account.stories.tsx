import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormCreatePointAccount } from '../components/form-recipes';
import { savePreview } from '../examples/marketplace-planned';

const meta = {
  title: 'Forms/Recipes/Create Point Account',
  component: FormCreatePointAccount,
  tags: ['autodocs'],
  args: { onSubmit: savePreview },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormCreatePointAccount>;

export default meta;
export const Default: StoryObj<typeof meta> = {};

export const SaveFailure: StoryObj<typeof meta> = {
  args: {
    onSubmit: async () => {
      throw new Error('Unable to save. Please try again.');
    },
  },
};
