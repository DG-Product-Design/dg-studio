import { expect, fn, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormTransferPoints } from '../components/form-recipes';
import { savePreview } from '../examples/marketplace-planned';

const meta = {
  title: 'Forms/Recipes/Transfer Points',
  component: FormTransferPoints,
  tags: ['autodocs'],
  args: { onSubmit: savePreview },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormTransferPoints>;

export default meta;
export const Default: StoryObj<typeof meta> = {};

export const SaveFailure: StoryObj<typeof meta> = {
  args: {
    onSubmit: async () => {
      throw new Error('Unable to save. Please try again.');
    },
  },
};

export const ValidateDestination: StoryObj<typeof meta> = {
  args: { onSubmit: fn() },
  play: async ({ canvas, canvasElement, args, userEvent, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.type(canvas.getByRole('spinbutton', { name: 'Amount in points' }), '250');
    await step('Reject a transfer to the same account', async () => {
      for (const label of ['From account', 'To account']) {
        await userEvent.click(canvas.getByRole('combobox', { name: label }));
        await userEvent.click(
          await body.findByRole('option', {
            name: 'Studio account',
          }),
        );
      }

      await userEvent.click(canvas.getByRole('button', { name: 'Transfer points' }));
      await expect(canvas.getAllByText('Choose a different destination account.')[0]).toBeVisible();
      await expect(args.onSubmit).not.toHaveBeenCalled();
    });
    await step('Submit a valid transfer to the host callback', async () => {
      await userEvent.click(canvas.getByRole('combobox', { name: 'To account' }));
      await userEvent.click(await body.findByRole('option', { name: 'Team account' }));
      await userEvent.click(canvas.getByRole('button', { name: 'Transfer points' }));
      await expect(await canvas.findByText('Changes saved.')).toBeVisible();
      await expect(args.onSubmit).toHaveBeenCalledTimes(1);
      await expect(args.onSubmit).toHaveBeenCalledWith(expect.objectContaining({ amount: 250 }));
    });
  },
};
