import { useState } from "react";
import { DataTable, type DataColumn } from "../components/data-table";
import { ActionBar, TagList } from "../components/content";
import { TextField } from "../components/fields";
import { Button } from "../components/ui/button";
import { Toast, ToastProvider } from "../components/feedback";
import { Search } from "lucide-react";
import type { ImageAsset } from "../components/media";
import { assets } from "./assets";
const columns: DataColumn<ImageAsset>[] = [
  {
    id: "title",
    header: "Name",
    cell: (row) => <span className="font-medium">{row.title}</span>,
    sortValue: (row) => row.title,
  },
  {
    id: "collection",
    header: "Collection",
    cell: (row) => row.collection,
    sortValue: (row) => row.collection,
  },
  {
    id: "dimensions",
    header: "Dimensions",
    cell: (row) => `${row.width} × ${row.height}`,
    sortValue: (row) => row.width * row.height,
  },
  { id: "tags", header: "Tags", cell: (row) => <TagList tags={row.tags} /> },
];
export function CollectionTable() {
  const [rows, setRows] = useState(assets);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [archived, setArchived] = useState<ImageAsset[]>([]);
  const [toast, setToast] = useState(false);
  function archive() {
    setArchived(rows.filter((row) => selected.includes(row.id)));
    setRows(rows.filter((row) => !selected.includes(row.id)));
    setSelected([]);
    setToast(true);
  }
  return (
    <ToastProvider>
      <main className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-3xl font-semibold">Collection manager</h1>
          <p className="mt-2 text-muted-foreground">
            Sort your assets and act on a selection.
          </p>
        </header>
        <TextField
          label="Search assets"
          hideLabel
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leadingIcon={<Search />}
          placeholder="Search by name…"
          className="max-w-md"
        />
        <ActionBar summary={`${selected.length} selected`}>
          <Button
            variant="ghost"
            disabled={!selected.length}
            onClick={() => setSelected([])}
          >
            Clear selection
          </Button>
          <Button disabled={!selected.length} onClick={archive}>
            Archive selected
          </Button>
        </ActionBar>
        <DataTable
          rows={rows.filter((row) =>
            row.title.toLowerCase().includes(query.toLowerCase()),
          )}
          columns={columns}
          getRowId={(row) => row.id}
          getRowLabel={(row) => row.title}
          caption="Collection assets"
          selectedIds={selected}
          onSelectionChange={setSelected}
          pageSize={4}
        />
        <p className="text-xs text-muted-foreground">
          Local example. Archiving affects this preview only.
        </p>
      </main>
      <Toast
        title={`${archived.length} assets archived`}
        description="You can restore this selection."
        open={toast}
        onOpenChange={setToast}
        action={{
          label: "Undo",
          altText: "Restore the most recently archived assets",
          onClick: () => {
            setRows((current) => [...current, ...archived]);
            setArchived([]);
          },
        }}
      />
    </ToastProvider>
  );
}
