import { useRef, useState } from 'react';
import { Form } from './recipe-form';
import { Tabs } from './navigation';
import { Banner } from './feedback';
import { DataTable } from './data-table';
import { ActionButton } from './action-button';
import { Button } from './ui/button';
import { Modal, type ModalProps } from './overlays';

export interface EmployeeRecord {
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  employeeId?: string;
}

export interface ImportIssue {
  row: number;
  message: string;
}

export interface EmployeeImportResult {
  records: EmployeeRecord[];
  errors: ImportIssue[];
  warnings: string[];
}

/** RFC-style quoted fields, escaped quotes, CRLF and embedded newlines. */
export function parseEmployeeCsv(text: string): EmployeeImportResult {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  let closed = false;

  const errors: ImportIssue[] = [];
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
          closed = true;
        }
      } else field += char;
      continue;
    }

    if (char === '"' && !field && !closed) {
      quoted = true;
      continue;
    }

    if (char === ',' || char === '\n' || char === '\r') {
      row.push(field.trim());
      field = '';
      closed = false;
      if (char !== ',') {
        if (row.some(Boolean)) rows.push(row);
        row = [];
        if (char === '\r' && text[i + 1] === '\n') i++;
      }

      continue;
    }

    if (closed && !/\s/.test(char))
      errors.push({
        row: rows.length + 1,
        message: 'Unexpected text after a quoted field.',
      });
    field += char;
  }

  if (quoted)
    errors.push({
      row: rows.length + 1,
      message: 'A quoted field is not closed.',
    });
  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  const headers = rows.shift() ?? [];
  const required = ['firstName', 'lastName', 'email'];
  const allowed = [...required, 'department', 'employeeId'];
  for (const h of required)
    if (!headers.includes(h)) errors.push({ row: 1, message: `Missing column: ${h}` });
  if (new Set(headers).size !== headers.length)
    errors.push({ row: 1, message: 'Column names must be unique.' });
  const warnings = headers
    .filter((h) => !allowed.includes(h))
    .map((h) => `Column “${h}” will be ignored.`);

  const seen = new Set<string>();

  const records = rows.map((values, index) => {
    const record = Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));

    if (values.length !== headers.length)
      errors.push({
        row: index + 2,
        message: 'Column count does not match the header.',
      });
    for (const h of required)
      if (!record[h]) errors.push({ row: index + 2, message: `${h} is required.` });
    if (record.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email))
      errors.push({ row: index + 2, message: 'Email address is invalid.' });
    if (seen.has(record.email?.toLowerCase()))
      errors.push({ row: index + 2, message: 'Duplicate email address.' });
    seen.add(record.email?.toLowerCase());

    return Object.fromEntries(
      allowed.map((h) => [h, record[h] ?? '']),
    ) as unknown as EmployeeRecord;
  });

  if (!records.length) errors.push({ row: 2, message: 'Add at least one employee row.' });

  return { records, errors, warnings };
}

export function ImportReview({
  result,
  busy = false,
  onConfirm,
  onBack,
}: {
  result: EmployeeImportResult;
  busy?: boolean;
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Review {result.records.length} employees</h3>
      {result.errors.length > 0 && (
        <Banner title={`${result.errors.length} import errors`} tone="danger">
          <ul>
            {result.errors.slice(0, 20).map((error, i) => (
              <li key={i}>
                Row {error.row}: {error.message}
              </li>
            ))}
          </ul>
        </Banner>
      )}
      {result.warnings.map((w) => (
        <Banner key={w} title={w} tone="warning" />
      ))}
      <DataTable
        rows={result.records.map((r, i) => ({ ...r, id: String(i) }))}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.email}
        caption="Employee import preview"
        columns={[
          {
            id: 'name',
            header: 'Name',
            cell: (r) => `${r.firstName} ${r.lastName}`,
          },
          { id: 'email', header: 'Email', cell: (r) => r.email },
          { id: 'department', header: 'Department', cell: (r) => r.department },
        ]}
        pageSize={5}
      />
      <div className="flex justify-end gap-3">
        <Button variant="outline" disabled={busy} onClick={onBack}>
          Choose another file
        </Button>
        <ActionButton
          loading={busy}
          disabled={!!result.errors.length || !result.records.length}
          onClick={onConfirm}
        >
          Import employees
        </ActionButton>
      </div>
    </div>
  );
}

export function EmployeeImport({
  onSubmit,
}: {
  onSubmit: (records: EmployeeRecord[]) => void | Promise<void>;
}) {
  const [result, setResult] = useState<EmployeeImportResult>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);

  const revision = useRef(0);

  async function read(file?: File) {
    if (!file) return;
    const current = ++revision.current;
    setError('');
    setComplete(false);
    if (file.size > 2_000_000) {
      setError('Choose a CSV smaller than 2 MB.');

      return;
    }

    try {
      const text = await file.text();
      if (current === revision.current) setResult(parseEmployeeCsv(text));
    } catch {
      setError('The file could not be read. Choose another CSV.');
    }
  }

  async function submit() {
    if (busy || !result || result.errors.length) return;
    setBusy(true);
    setError('');
    try {
      await onSubmit(result.records);
      setComplete(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Banner title="Import wasn’t completed" tone="danger">
          {error}
        </Banner>
      )}
      {complete ? (
        <Banner title="Employees imported" tone="success">
          {result?.records.length} records accepted.
        </Banner>
      ) : result ? (
        <ImportReview
          result={result}
          busy={busy}
          onConfirm={() => void submit()}
          onBack={() => {
            revision.current++;
            setResult(undefined);
            setError('');
          }}
        />
      ) : (
        <label className="block space-y-3 rounded-xl border border-dashed p-5">
          <span className="block font-semibold">Choose employee CSV</span>
          <span className="block text-sm text-muted-foreground">
            Columns: firstName, lastName, email. Optional: department, employeeId.
          </span>
          <input
            type="file"
            accept=".csv,text/csv"
            aria-label="Employee CSV"
            onChange={(e) => void read(e.target.files?.[0])}
          />
        </label>
      )}
    </div>
  );
}

export function FormAddEmployee({
  onSubmit,
}: {
  onSubmit: (records: EmployeeRecord[]) => void | Promise<void>;
}) {
  const [mode, setMode] = useState('one');

  return (
    <Tabs
      label="Add employees"
      value={mode}
      onValueChange={setMode}
      items={[
        {
          value: 'one',
          label: 'One employee',
          content: (
            <Form
              title="Add employee"
              submitLabel="Add employee"
              fields={[
                { name: 'firstName', label: 'First name', required: true },
                { name: 'lastName', label: 'Last name', required: true },
                {
                  name: 'email',
                  label: 'Email address',
                  type: 'email',
                  required: true,
                },
              ]}
              onSubmit={(v) =>
                onSubmit([
                  {
                    firstName: String(v.firstName),
                    lastName: String(v.lastName),
                    email: String(v.email),
                  },
                ])
              }
            />
          ),
        },
        {
          value: 'csv',
          label: 'Import CSV',
          content: <EmployeeImport onSubmit={onSubmit} />,
        },
      ]}
    />
  );
}

export function ModalImportReview({
  result,
  onConfirm,
  onBack,
  busy,
  ...props
}: Omit<ModalProps, 'children' | 'title' | 'description'> & Parameters<typeof ImportReview>[0]) {
  return (
    <Modal
      {...props}
      title="Review import"
      description="Check the records before importing."
      className="max-w-3xl"
    >
      <ImportReview {...{ result, onConfirm, onBack, busy }} />
    </Modal>
  );
}
