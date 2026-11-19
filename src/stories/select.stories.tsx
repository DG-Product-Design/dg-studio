import { useId, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { SelectField } from '../components/fields';
import { Button } from '../components/ui/button';
import storyExamples1 from './select.stories.tsx?examples';

function Example({ longLabel = false, form = false }: { longLabel?: boolean; form?: boolean }) {
  const id = useId();
  const [value, setValue] = useState(longLabel ? 'long' : '');
  const [submitted, setSubmitted] = useState('');

  return (
    <form
      className="grid w-72 max-w-full gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(String(new FormData(event.currentTarget).get('collection')));
      }}
    >
      <label htmlFor={id} className="text-sm font-semibold">
        Collection type
      </label>
      <Select name="collection" required={form} value={value} onValueChange={setValue}>
        <SelectTrigger id={id} className={longLabel ? 'w-44' : undefined}>
          <SelectValue placeholder="Choose a collection" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Active collections</SelectLabel>
            <SelectItem value="campaign">Campaign</SelectItem>
            <SelectItem value="unavailable" disabled>
              Private collection
            </SelectItem>
            <SelectItem value="moodboard">Moodboard</SelectItem>
            {longLabel && (
              <SelectItem value="long">A collection with a much longer descriptive name</SelectItem>
            )}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Past work</SelectLabel>
            <SelectItem value="archive">Archive</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {form ? (
        <>
          <Button type="submit">Save collection</Button>
          <p role="status" className="text-sm text-muted-foreground">
            {submitted ? `Submitted: ${submitted}` : 'Choose a collection to save.'}
          </p>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">
          Use the arrow keys or type an option’s name.
        </p>
      )}
    </form>
  );
}

const meta = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The shared shadcn/ui Select, built on Radix. The trigger keeps a 12px inset around its chevron. Menus support groups, disabled options, typeahead, keyboard navigation, native form values, and theme-aware portals. Use SelectField when you also need a label, hint, or validation message.',
      },
    },
  },
  render: () => <Example />,
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: { code: storyExamples1.Example, language: 'tsx', type: 'code' },
    },
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox');
    const icon = trigger.querySelector('[data-slot="select-chevron"]')!;
    const inset = trigger.getBoundingClientRect().right - icon.getBoundingClientRect().right;

    await expect(inset).toBeGreaterThanOrEqual(12);
    await expect(inset).toBeLessThanOrEqual(14);
  },
};

export const KeyboardAndGroups: Story = {
  parameters: {
    docs: {
      source: { code: storyExamples1.Example, language: 'tsx', type: 'code' },
    },
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getByRole('combobox');
    await userEvent.click(trigger);
    const body = within(canvasElement.ownerDocument.body);
    await expect(body.getByRole('option', { name: 'Private collection' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await userEvent.keyboard('{Home}{ArrowDown}{Enter}');
    await expect(trigger).toHaveTextContent('Moodboard');
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(body.getByRole('listbox')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
  },
};

export const LongLabel: Story = {
  parameters: {
    docs: {
      source: { code: storyExamples1.Example, language: 'tsx', type: 'code' },
    },
  },
  render: () => <Example longLabel />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox');
    const value = trigger.querySelector('[data-slot="select-value"]')!;
    const icon = trigger.querySelector('[data-slot="select-chevron"]')!;
    await expect(value.getBoundingClientRect().right).toBeLessThan(
      icon.getBoundingClientRect().left,
    );
  },
};

export const FieldStates: Story = {
  render: () => (
    <div className="grid max-w-sm gap-6">
      <SelectField
        label="Required collection"
        value=""
        onValueChange={() => {}}
        options={[{ value: 'campaign', label: 'Campaign' }]}
        error="Choose a collection before continuing."
      />
      <SelectField
        label="Archived collection"
        value="archive"
        onValueChange={() => {}}
        options={[{ value: 'archive', label: 'Archive' }]}
        disabled
        hint="This collection is read only."
      />
    </div>
  ),
};

export const NativeForm: Story = {
  parameters: {
    docs: {
      source: { code: storyExamples1.Example, language: 'tsx', type: 'code' },
    },
  },
  render: () => <Example form />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('combobox'));
    await userEvent.click(
      within(canvasElement.ownerDocument.body).getByRole('option', {
        name: 'Campaign',
      }),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Save collection' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Submitted: campaign');
  },
};
