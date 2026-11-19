import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EditableCell } from './table-tools';
import { deferred } from '../test/deferred';

describe('EditableCell', () => {
  it('cancels with Escape and discards the unsaved draft', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<EditableCell label="Name" value="Original" onSave={onSave} />);
    await user.click(screen.getByRole('button', { name: 'Edit Name: Original' }));
    await user.clear(screen.getByRole('textbox', { name: 'Name' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Unsaved{Escape}');
    expect(onSave).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Edit Name: Original' }));
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Original');
  });
  it('keeps failed edits for retry and waits for the host save', async () => {
    const user = userEvent.setup();
    const pending = deferred();

    const onSave = vi
      .fn()
      .mockRejectedValueOnce(new Error('Try again'))
      .mockReturnValueOnce(pending.promise);

    const { rerender } = render(<EditableCell label="Name" value="Original" onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Edit Name: Original' }));
    const input = screen.getByRole('textbox', { name: 'Name' });
    await user.clear(input);
    await user.type(input, 'Renamed{Enter}');
    expect(await screen.findByText('Try again')).toBeVisible();
    expect(input).toHaveValue('Renamed');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(input).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    await act(async () => pending.resolve());
    rerender(<EditableCell label="Name" value="Renamed" onSave={onSave} />);
    expect(screen.getByRole('button', { name: 'Edit Name: Renamed' })).toBeVisible();
    expect(onSave.mock.calls).toEqual([['Renamed'], ['Renamed']]);
  });
});
