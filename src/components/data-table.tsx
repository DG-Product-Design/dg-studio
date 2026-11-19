import { Fragment, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Banner, Skeleton } from './feedback';
import { EmptyState } from './media';
import { Pagination } from './navigation';

export interface DataColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
}

export interface TableSort {
  id: string;
  direction: 'asc' | 'desc';
}

export interface RemoteTableState {
  page: number;
  totalRows: number;
  sort?: TableSort;
  onPageChange: (page: number) => void;
  onSortChange: (sort: TableSort) => void;
}

export interface DataTableProps<T> {
  rows: T[];
  columns: DataColumn<T>[];
  getRowId: (row: T) => string;
  getRowLabel: (row: T) => string;
  caption: string;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  pageSize?: number;
  remote?: RemoteTableState;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  hiddenColumns?: string[];
  renderExpanded?: (row: T) => ReactNode;
  emptyState?: ReactNode;
}

function LoadingCell({
  loading,
  children,
  compact = false,
}: {
  loading: boolean;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="relative" data-loading-cell={loading || undefined}>
      <div className={loading ? 'invisible' : undefined} inert={loading || undefined}>
        {children}
      </div>
      {loading && (
        <Skeleton
          className={`absolute top-1/2 left-0 h-4 -translate-y-1/2 ${compact ? 'w-4' : 'w-3/4 max-w-40'}`}
        />
      )}
    </div>
  );
}

/** Client-side sorting/paging for bounded collections. Supply stable row IDs for selection. */
export function DataTable<T>({
  rows,
  columns: allColumns,
  getRowId,
  getRowLabel,
  caption,
  selectedIds = [],
  onSelectionChange,
  pageSize = 5,
  remote,
  loading = false,
  error,
  onRetry,
  hiddenColumns = [],
  renderExpanded,
  emptyState,
}: DataTableProps<T>) {
  const [localSort, setSort] = useState<TableSort>();
  const sort = remote ? remote.sort : localSort;
  const columns = allColumns.filter((c) => !hiddenColumns.includes(c.id));
  const [expanded, setExpanded] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const size = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 5;

  const sortColumn = columns.find((c) => c.id === sort?.id);
  const sorted =
    !remote && sortColumn?.sortValue
      ? [...rows].sort((a, b) => {
          const left = sortColumn.sortValue!(a);
          const right = sortColumn.sortValue!(b);

          const order =
            typeof left === 'number' && typeof right === 'number'
              ? left - right
              : String(left).localeCompare(String(right));

          return sort?.direction === 'desc' ? -order : order;
        })
      : rows;

  const pageCount = Math.max(1, Math.ceil((remote?.totalRows ?? rows.length) / size));

  const currentPage = Math.max(1, Math.min(remote?.page ?? page, pageCount));
  const visible = remote ? rows : sorted.slice((currentPage - 1) * size, currentPage * size);

  const visibleIds = visible.map(getRowId);
  const all = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  const some = visibleIds.some((id) => selectedIds.includes(id));

  return (
    <div className="space-y-4">
      {error && (
        <Banner
          title="Unable to load rows"
          tone="danger"
          action={
            onRetry && (
              <Button type="button" onClick={onRetry}>
                Retry
              </Button>
            )
          }
        >
          {error}
        </Banner>
      )}
      <div
        role="region"
        aria-label={caption}
        tabIndex={0}
        className="overflow-x-auto rounded-xl border"
      >
        <span role="status" className="sr-only">
          {loading ? 'Loading rows…' : ''}
        </span>
        <table
          aria-busy={loading}
          className="w-full min-w-[540px] border-collapse text-left text-sm"
        >
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-muted/50">
            <tr>
              {onSelectionChange && (
                <th scope="col" className="w-12 p-4">
                  <input
                    type="checkbox"
                    aria-label="Select all visible rows"
                    checked={all}
                    ref={(node) => {
                      if (node) node.indeterminate = some && !all;
                    }}
                    onChange={(e) =>
                      onSelectionChange(
                        e.target.checked
                          ? [...new Set([...selectedIds, ...visibleIds])]
                          : selectedIds.filter((id) => !visibleIds.includes(id)),
                      )
                    }
                    disabled={loading || !visible.length}
                    className="size-4 accent-primary"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={
                    column.sortValue
                      ? sort?.id === column.id
                        ? sort.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                      : undefined
                  }
                  className="px-4 py-3 font-semibold"
                >
                  {column.sortValue ? (
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded py-1"
                      disabled={loading}
                      onClick={() => {
                        const nextSort: TableSort = {
                          id: column.id,
                          direction:
                            sort?.id === column.id && sort.direction === 'asc' ? 'desc' : 'asc',
                        };

                        if (remote) {
                          remote.onSortChange(nextSort);
                          remote.onPageChange(1);
                        } else {
                          setSort(nextSort);
                          setPage(1);
                        }
                      }}
                    >
                      {column.header}
                      {sort?.id === column.id ? (
                        sort.direction === 'asc' ? (
                          <ArrowUp aria-hidden className="size-3" />
                        ) : (
                          <ArrowDown aria-hidden className="size-3" />
                        )
                      ) : (
                        <ArrowUpDown aria-hidden className="size-3" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
              {renderExpanded && (
                <th scope="col" className="w-16 p-3">
                  <span className="sr-only">Row details</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody aria-hidden={loading || undefined} inert={loading || undefined}>
            {loading &&
              !visible.length &&
              Array.from({ length: size }, (_, index) => (
                <tr key={index} className="border-t bg-card">
                  {onSelectionChange && (
                    <td className="p-4">
                      <Skeleton className="size-4" />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.id} className="px-4 py-4" data-loading-cell>
                      <Skeleton className="my-0.5 h-4 w-3/4 max-w-40" />
                    </td>
                  ))}
                  {renderExpanded && (
                    <td className="px-4 py-3">
                      <Skeleton className="ml-auto size-8" />
                    </td>
                  )}
                </tr>
              ))}
            {visible.map((row) => {
              const id = getRowId(row);

              return (
                <Fragment key={id}>
                  <tr className="border-t bg-card">
                    {onSelectionChange && (
                      <td className="p-4">
                        <LoadingCell loading={loading} compact>
                          <input
                            type="checkbox"
                            aria-label={`Select ${getRowLabel(row)}`}
                            checked={selectedIds.includes(id)}
                            onChange={(e) =>
                              onSelectionChange(
                                e.target.checked
                                  ? [...selectedIds, id]
                                  : selectedIds.filter((value) => value !== id),
                              )
                            }
                            className="size-4 accent-primary"
                          />
                        </LoadingCell>
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.id} className="px-4 py-4">
                        <LoadingCell loading={loading}>{column.cell(row)}</LoadingCell>
                      </td>
                    ))}
                    {renderExpanded && (
                      <td className="px-4 py-3 text-right">
                        <LoadingCell loading={loading}>
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            aria-expanded={expanded.includes(id)}
                            aria-label={`${expanded.includes(id) ? 'Hide' : 'Show'} details for ${getRowLabel(row)}`}
                            onClick={() =>
                              setExpanded((current) =>
                                current.includes(id)
                                  ? current.filter((v) => v !== id)
                                  : [...current, id],
                              )
                            }
                          >
                            <ChevronDown
                              aria-hidden
                              className={`size-4 motion-safe:transition-transform motion-safe:duration-200 ${expanded.includes(id) ? 'rotate-180' : 'rotate-0'}`}
                            />
                          </Button>
                        </LoadingCell>
                      </td>
                    )}
                  </tr>
                  {renderExpanded && expanded.includes(id) && (
                    <tr className="border-t bg-muted/30">
                      <td
                        colSpan={columns.length + (onSelectionChange ? 1 : 0) + 1}
                        className="p-5"
                      >
                        <LoadingCell loading={loading}>{renderExpanded(row)}</LoadingCell>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {!visible.length && !loading && !error && (
              <tr>
                <td
                  colSpan={columns.length + (onSelectionChange ? 1 : 0) + (renderExpanded ? 1 : 0)}
                  className="p-4"
                >
                  {emptyState ?? (
                    <EmptyState
                      title="No results"
                      description="Try another search or add items to this collection."
                    />
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {(remote?.totalRows ?? rows.length) > size && (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          onPageChange={remote?.onPageChange ?? setPage}
        />
      )}
    </div>
  );
}
