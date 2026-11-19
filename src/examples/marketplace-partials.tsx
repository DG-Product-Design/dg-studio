import { useCallback, useEffect, useState } from 'react';
import { SearchSelect, RangeSlider } from '../components/advanced-fields';
import { CardTagList, BalanceActionBar, AdminToolbar } from '../components/marketplace-content';
import { MarketplaceGrid, Row, Column, GridHelper } from '../components/layout-grid';
import { SettingsDrawer, NestedMenu } from '../components/menus';
import { FormWizard, useWizardDraft } from '../components/form-wizard';
import { TextField, SwitchField, type SelectOption } from '../components/fields';
import { Button } from '../components/ui/button';
import { Banner } from '../components/feedback';
import { DataTable, type TableSort } from '../components/data-table';
import {
  EditableCell,
  TableActionsBar,
  TableFilters,
  matchesTableFilters,
  createTableCsv,
  type TableFilterValue,
} from '../components/table-tools';

const choices: SelectOption[] = [
  {
    value: 'studio',
    label: 'Studio account',
    description: '1,250 points available',
  },
  {
    value: 'team',
    label: 'Team account',
    description: '8,000 points available',
  },
  { value: 'archive', label: 'Archived account', disabled: true },
];

export function SearchSelectionDemo() {
  const [value, setValue] = useState<SelectOption | SelectOption[] | null>(null);

  const load = useCallback(
    (query: string, signal: AbortSignal) =>
      new Promise<SelectOption[]>((resolve, reject) => {
        const timer = setTimeout(() => {
          if (query === 'error')
            reject(new Error('Account search unavailable. Try another search.'));
          else resolve(choices.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())));
        }, 250);

        signal.addEventListener(
          'abort',
          () => {
            clearTimeout(timer);
            reject(new DOMException('Aborted', 'AbortError'));
          },
          { once: true },
        );
      }),
    [],
  );

  return (
    <div className="max-w-md space-y-4">
      <SearchSelect
        label="Accounts"
        value={value}
        onValueChange={setValue}
        loadOptions={load}
        multiple
        renderOption={(o) => (
          <span className="font-medium">
            {o.label}
            <span className="block text-xs font-normal text-muted-foreground">{o.description}</span>
          </span>
        )}
        onCreate={(q) => ({
          value: q.toLowerCase(),
          label: q,
          description: 'New local account',
        })}
      />
      <p className="text-xs text-muted-foreground">
        Local async adapter. Search “error” to preview recovery.
      </p>
    </div>
  );
}

export function DualRangeDemo() {
  const [value, setValue] = useState<[number, number]>([20, 80]);

  return (
    <div className="max-w-md">
      <RangeSlider
        label="Budget"
        value={value}
        onValueChange={setValue}
        formatValue={(v) => `$${v}`}
      />
    </div>
  );
}

export function VendorTagsDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  const tags = [
    'Travel',
    'Outdoors',
    'Family',
    'Wellness',
    'Learning',
    'Local',
    'Food',
    'Fitness',
    'Experiences',
    'Home',
  ].map((label) => ({ id: label, slug: label.toLowerCase(), label }));

  return (
    <div className="max-w-lg space-y-4">
      <CardTagList
        tags={tags}
        selected={selected}
        onSelectTag={(tag) =>
          setSelected((s) =>
            s.includes(tag.slug) ? s.filter((v) => v !== tag.slug) : [...s, tag.slug],
          )
        }
      />
      <p role="status" className="text-sm">
        {selected.length ? `Filtering: ${selected.join(', ')}` : 'All vendors'}
      </p>
    </div>
  );
}

export function BalanceDemo() {
  const [message, setMessage] = useState('');

  return (
    <div className="max-w-xl space-y-4">
      <BalanceActionBar points={0} description="Remaining points balance">
        <Button onClick={() => setMessage('Add points selected')}>Add points</Button>
      </BalanceActionBar>
      <AdminToolbar
        role="owner"
        onAddEmployee={() => setMessage('Add employee selected')}
        onCreateProgram={() => setMessage('Create program selected')}
      />
      <p role="status">{message}</p>
    </div>
  );
}

export function GridDemo() {
  return (
    <MarketplaceGrid>
      <GridHelper defaultVisible>
        <Row>
          <Column span={{ mobile: 12, desktop: 10 }} debug>
            <div className="bg-card p-5">
              Main content
              <Row columns={{ mobile: 12, desktop: 10 }}>
                <Column span={{ mobile: 6, desktop: 5 }} debug>
                  Nested half
                </Column>
                <Column span={{ mobile: 6, desktop: 5 }} debug>
                  Nested half
                </Column>
              </Row>
            </div>
          </Column>
          <Column span={{ mobile: 12, desktop: 6 }} debug>
            <div className="bg-card p-5">Side panel</div>
          </Column>
        </Row>
        <Row className="mt-4">
          <Column span={4} offset={2} debug>
            Offset by two
          </Column>
          <Column fill debug>
            Fill remaining space
          </Column>
        </Row>
      </GridHelper>
    </MarketplaceGrid>
  );
}

export function DrawerDemo() {
  const [open, setOpen] = useState(false);
  const [notify, setNotify] = useState(true);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open settings drawer</Button>
      <SettingsDrawer
        open={open}
        onOpenChange={setOpen}
        title="Studio settings"
        description="Navigate sections without leaving the panel."
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}
        sections={[
          {
            id: 'account',
            label: 'Account',
            children: [
              {
                id: 'profile',
                label: 'Profile',
                content: <TextField label="Display name" defaultValue="D.G" />,
              },
              {
                id: 'notifications',
                label: 'Notifications',
                content: (
                  <SwitchField label="Email updates" checked={notify} onCheckedChange={setNotify} />
                ),
              },
            ],
          },
          {
            id: 'workspace',
            label: 'Workspace',
            content: <p className="text-sm">Miami studio</p>,
          },
        ]}
      />
    </>
  );
}

export function NestedMenuDemo() {
  const [message, setMessage] = useState('Choose an action');

  return (
    <div className="space-y-4">
      <NestedMenu
        trigger={<Button variant="outline">Collection actions</Button>}
        items={[
          {
            id: 'edit',
            label: 'Rename',
            onSelect: () => setMessage('Rename selected'),
          },
          {
            id: 'export',
            label: 'Export',
            children: [
              {
                id: 'png',
                label: 'PNG',
                onSelect: () => setMessage('PNG export selected'),
              },
              {
                id: 'jpg',
                label: 'JPEG',
                onSelect: () => setMessage('JPEG export selected'),
              },
            ],
          },
          { id: 'locked', label: 'Transfer ownership', disabled: true },
          {
            id: 'delete',
            label: 'Archive',
            destructive: true,
            onSelect: () => setMessage('Archive selected'),
          },
        ]}
      />
      <p role="status">{message}</p>
    </div>
  );
}

type Draft = { name: string; advanced: boolean; stepId: string };

function validDraft(v: unknown): v is Draft {
  return (
    typeof v === 'object' &&
    v !== null &&
    'name' in v &&
    typeof v.name === 'string' &&
    'advanced' in v &&
    typeof v.advanced === 'boolean' &&
    'stepId' in v &&
    typeof v.stepId === 'string'
  );
}

export function DraftWizardDemo() {
  const { value, setValue, clear, storageError } = useWizardDraft(
    'dg-studio-demo-draft-v1',
    { name: '', advanced: false, stepId: 'details' },
    validDraft,
  );

  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);

  return (
    <div className="max-w-xl space-y-4">
      {storageError && (
        <Banner title="Draft storage" tone="warning">
          {storageError}
        </Banner>
      )}
      {complete ? (
        <Banner title="Draft prepared" tone="success">
          The saved draft has been cleared.
        </Banner>
      ) : (
        <FormWizard
          progress={{ stepId: value.stepId }}
          onProgressChange={(p) => setValue((v) => ({ ...v, ...p }))}
          onComplete={() => {
            clear();
            setComplete(true);
          }}
          finishLabel="Prepare draft"
          steps={[
            {
              id: 'details',
              label: 'Details',
              validate: () => {
                setError(value.name.trim() ? '' : 'Enter a name.');

                return !!value.name.trim();
              },
              content: (
                <>
                  <TextField
                    label="Draft name"
                    value={value.name}
                    error={error || undefined}
                    onChange={(e) => setValue((v) => ({ ...v, name: e.target.value }))}
                  />
                  <SwitchField
                    label="Advanced delivery"
                    checked={value.advanced}
                    onCheckedChange={(advanced) => setValue((v) => ({ ...v, advanced }))}
                  />
                </>
              ),
            },
            {
              id: 'delivery',
              label: 'Delivery',
              visible: value.advanced,
              content: <p>Deliver this collection as an archive.</p>,
            },
            {
              id: 'review',
              label: 'Review',
              content: (
                <p>
                  Prepare {value.name} with {value.advanced ? 'advanced' : 'standard'} delivery.
                </p>
              ),
            },
          ]}
        />
      )}
      <Button
        variant="ghost"
        onClick={() => {
          clear();
          setComplete(false);
          setError('');
        }}
      >
        Discard draft
      </Button>
      <p className="text-xs text-muted-foreground">
        This example saves the name, delivery choice, and current step in this browser.
      </p>
    </div>
  );
}

const initialRows = Array.from({ length: 11 }, (_, i) => ({
  id: String(i + 1),
  name: ['Dusk study', 'After the sunset', 'The scenic route', 'Get outside'][i % 4] + ` ${i + 1}`,
  status: i % 2 ? 'Draft' : 'Ready',
  date: `2026-11-${String(i + 1).padStart(2, '0')}`,
}));

export function AdvancedTableDemo() {
  const [data, setData] = useState(initialRows);
  const [rows, setRows] = useState(initialRows.slice(0, 4));
  const [total, setTotal] = useState(data.length);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<TableSort>();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, TableFilterValue>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [hideDates, setHideDates] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    const timer = setTimeout(() => {
      if (query === 'error') {
        setError('The demo data service is unavailable. Clear the search and retry.');
        setRows([]);
      } else {
        let next = data.filter(
          (row) =>
            row.name.toLowerCase().includes(query.toLowerCase()) &&
            matchesTableFilters(row, filters),
        );

        if (sort)
          next = [...next].sort(
            (a, b) =>
              String(a[sort.id as keyof typeof a]).localeCompare(
                String(b[sort.id as keyof typeof b]),
              ) * (sort.direction === 'asc' ? 1 : -1),
          );
        setTotal(next.length);
        setRows(next.slice((page - 1) * 4, page * 4));
      }

      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [data, page, sort, query, filters, retry]);

  function download() {
    const selectedRows = data.filter(
      (row) =>
        (!selected.length || selected.includes(row.id)) &&
        row.name.toLowerCase().includes(query.toLowerCase()) &&
        matchesTableFilters(row, filters),
    );

    const blob = new Blob(
      [
        createTableCsv(
          hideDates ? ['Name', 'Status'] : ['Name', 'Status', 'Date'],
          selectedRows.map((r) => (hideDates ? [r.name, r.status] : [r.name, r.status, r.date])),
        ),
      ],
      { type: 'text/csv;charset=utf-8' },
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'collection.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <main className="mx-auto max-w-5xl space-y-5">
      <h1 className="text-2xl font-semibold">Asset operations</h1>
      <TableActionsBar
        query={query}
        onQueryChange={(q) => {
          setQuery(q);
          setPage(1);
        }}
        selectedCount={selected.length}
        onExport={download}
      >
        <Button variant="ghost" onClick={() => setSelected([])}>
          Clear selection
        </Button>
      </TableActionsBar>
      <TableFilters
        filters={[
          {
            id: 'status',
            label: 'Status',
            type: 'choice',
            options: [
              { value: 'Draft', label: 'Draft' },
              { value: 'Ready', label: 'Ready' },
            ],
          },
          { id: 'date', label: 'Created', type: 'date' },
        ]}
        value={filters}
        onValueChange={(v) => {
          setFilters(v);
          setPage(1);
        }}
      />
      <SwitchField label="Hide date column" checked={hideDates} onCheckedChange={setHideDates} />
      <DataTable
        rows={rows}
        columns={[
          {
            id: 'name',
            header: 'Name',
            sortValue: (r) => r.name,
            cell: (r) => (
              <EditableCell
                label="asset name"
                value={r.name}
                onSave={(value) => {
                  if (!value.trim()) throw new Error('A name is required.');
                  setData((current) =>
                    current.map((item) => (item.id === r.id ? { ...item, name: value } : item)),
                  );
                }}
              />
            ),
          },
          { id: 'status', header: 'Status', cell: (r) => r.status },
          {
            id: 'date',
            header: 'Created',
            sortValue: (r) => r.date,
            cell: (r) => r.date,
          },
        ]}
        hiddenColumns={hideDates ? ['date'] : []}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
        caption="Asset operations"
        pageSize={4}
        selectedIds={selected}
        onSelectionChange={setSelected}
        remote={{
          page,
          totalRows: total,
          sort,
          onPageChange: setPage,
          onSortChange: setSort,
        }}
        loading={loading}
        error={error}
        onRetry={() => setRetry((n) => n + 1)}
        renderExpanded={(r) => (
          <p>
            Asset {r.id} · {r.status} · Created {r.date}
          </p>
        )}
      />
      <p className="text-xs text-muted-foreground">
        Simulated remote paging. Inline edits, filters, and exports use local sample data.
      </p>
    </main>
  );
}
