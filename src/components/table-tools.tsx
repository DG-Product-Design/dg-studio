import { useEffect, useState, type ReactNode } from 'react';
import { TextField, MultiSelectField, RadioCards } from './fields';
import { Button } from './ui/button';
import { Popover } from './navigation';

export interface DateRange {
  from: string;
  to: string;
}

export function DateRangeField({
  label = 'Date range',
  value,
  onValueChange,
  max,
}: {
  label?: string;
  value: DateRange;
  onValueChange: (value: DateRange) => void;
  max?: string;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-sm font-semibold">{label}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField
          label="Start date"
          type="date"
          value={value.from}
          max={value.to || max}
          onChange={(e) => onValueChange({ ...value, from: e.target.value })}
        />
        <TextField
          label="End date"
          type="date"
          value={value.to}
          min={value.from || undefined}
          max={max}
          error={
            value.from && value.to && value.to < value.from
              ? 'End date must be on or after the start date.'
              : undefined
          }
          onChange={(e) => onValueChange({ ...value, to: e.target.value })}
        />
      </div>
    </fieldset>
  );
}

export function FilterButtonDateRange(props: Parameters<typeof DateRangeField>[0]) {
  return (
    <Popover
      title={props.label ?? 'Date range'}
      trigger={
        <Button type="button" variant="outline">
          {props.value.from || props.value.to
            ? `${props.value.from || 'Any'} – ${props.value.to || 'Any'}`
            : (props.label ?? 'Date range')}
        </Button>
      }
    >
      <DateRangeField {...props} />
      <Button
        type="button"
        variant="ghost"
        className="mt-3"
        onClick={() => props.onValueChange({ from: '', to: '' })}
      >
        Clear dates
      </Button>
    </Popover>
  );
}

export function FilterButtonRadio({
  label,
  value,
  options,
  onValueChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
}) {
  return (
    <Popover
      title={label}
      trigger={
        <Button type="button" variant="outline">
          {label}: {options.find((o) => o.value === value)?.label ?? 'All'}
        </Button>
      }
    >
      <RadioCards label={label} options={options} value={value} onValueChange={onValueChange} />
    </Popover>
  );
}

export type TableFilter = {
  id: string;
  label: string;
  type: 'text' | 'choice' | 'date';
  options?: { value: string; label: string }[];
};

export type TableFilterValue = string | string[] | DateRange;

export function TableFilters({
  filters,
  value,
  onValueChange,
}: {
  filters: TableFilter[];
  value: Record<string, TableFilterValue>;
  onValueChange: (value: Record<string, TableFilterValue>) => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {filters.map((f) => (
        <div key={f.id} className="min-w-40">
          {f.type === 'choice' ? (
            <MultiSelectField
              label={f.label}
              options={f.options ?? []}
              value={Array.isArray(value[f.id]) ? (value[f.id] as string[]) : []}
              onValueChange={(v) => onValueChange({ ...value, [f.id]: v })}
            />
          ) : f.type === 'date' ? (
            <FilterButtonDateRange
              label={f.label}
              value={
                typeof value[f.id] === 'object' && !Array.isArray(value[f.id])
                  ? (value[f.id] as DateRange)
                  : { from: '', to: '' }
              }
              onValueChange={(v) => onValueChange({ ...value, [f.id]: v })}
            />
          ) : (
            <TextField
              label={f.label}
              value={typeof value[f.id] === 'string' ? (value[f.id] as string) : ''}
              onChange={(e) => onValueChange({ ...value, [f.id]: e.target.value })}
            />
          )}
        </div>
      ))}
      <Button type="button" variant="ghost" onClick={() => onValueChange({})}>
        Reset filters
      </Button>
    </div>
  );
}

export function matchesTableFilters(
  row: Record<string, unknown>,
  filters: Record<string, TableFilterValue>,
) {
  return Object.entries(filters).every(([key, value]) => {
    const source = row[key];
    if (Array.isArray(value)) return !value.length || value.includes(String(source));
    if (typeof value === 'string')
      return String(source ?? '')
        .toLowerCase()
        .includes(value.toLowerCase());
    const date = String(source ?? '').slice(0, 10);
    if ((value.from || value.to) && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

    return (!value.from || date >= value.from) && (!value.to || date <= value.to);
  });
}

/** Quotes every cell and neutralizes spreadsheet formulas in user-authored strings. */
export function createTableCsv(headers: string[], rows: (string | number | null | undefined)[][]) {
  const cell = (value: string | number | null | undefined) => {
    let text = String(value ?? '');
    if (typeof value === 'string' && /^[\s]*[=+@-]/.test(text)) text = "'" + text;

    return '"' + text.replaceAll('"', '""') + '"';
  };

  return [headers, ...rows].map((row) => row.map(cell).join(',')).join('\r\n');
}

export function TableActionsBar({
  query,
  onQueryChange,
  selectedCount,
  children,
  onExport,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  selectedCount: number;
  children?: ReactNode;
  onExport?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <TextField
        label="Search table"
        hideLabel
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search…"
      />
      <p role="status" className="mr-auto text-sm">
        {selectedCount} selected
      </p>
      {children}
      {onExport && (
        <Button type="button" variant="outline" onClick={onExport}>
          Export CSV
        </Button>
      )}
    </div>
  );
}

export function EditableCell({
  value,
  label,
  onSave,
}: {
  value: string;
  label: string;
  onSave: (value: string) => void | Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  async function save() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await onSave(draft);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to save.');
    } finally {
      setBusy(false);
    }
  }

  return editing ? (
    <div className="min-w-48 space-y-2">
      <TextField
        label={label}
        hideLabel
        autoFocus
        value={draft}
        disabled={busy}
        error={error || undefined}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && !busy) setEditing(false);
          if (e.key === 'Enter') {
            e.preventDefault();
            void save();
          }
        }}
      />
      <div className="flex gap-2">
        <Button type="button" size="sm" disabled={busy} onClick={() => void save()}>
          {busy ? 'Saving…' : 'Save'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={busy}
          onClick={() => setEditing(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  ) : (
    <button
      type="button"
      aria-label={`Edit ${label}: ${value}`}
      className="rounded text-left underline decoration-dotted underline-offset-4"
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
    >
      {value || 'Add value'}
    </button>
  );
}
