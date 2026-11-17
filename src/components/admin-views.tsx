import { useState, type ReactNode } from "react";
import { Card } from "./content";
import { Button } from "./ui/button";
import { ActionButton } from "./action-button";
import { Banner, Skeleton } from "./feedback";
import { DataTable } from "./data-table";
import {
  TableFilters,
  type TableFilter,
  type TableFilterValue,
} from "./table-tools";
import { Modal, type ModalProps } from "./overlays";
import { SelectField, SwitchField } from "./fields";
import { CardNextButton } from "./foundation-primitives";
import { Form, type FormValues } from "./recipe-form";
import { SettingsTable, AdminMetricsBar } from "./account-components";
export function MetricsFilterBar(props: Parameters<typeof TableFilters>[0]) {
  return <TableFilters {...props} />;
}
export function MetricsGraphWrapper({
  title,
  children,
  loading = false,
  empty = false,
  error,
  filters = [],
  filterValues = {},
  onFilterChange,
  onDownload,
}: {
  title: string;
  children: ReactNode;
  loading?: boolean;
  empty?: boolean;
  error?: string;
  filters?: TableFilter[];
  filterValues?: Record<string, TableFilterValue>;
  onFilterChange?: (value: Record<string, TableFilterValue>) => void;
  onDownload?: () => void | Promise<void>;
}) {
  const [downloading, setDownloading] = useState(false),
    [failure, setFailure] = useState("");
  async function download() {
    if (!onDownload || downloading) return;
    setDownloading(true);
    setFailure("");
    try {
      await onDownload();
    } catch (e) {
      setFailure(e instanceof Error ? e.message : "Export failed.");
    } finally {
      setDownloading(false);
    }
  }
  return (
    <Card
      title={title}
      action={
        onDownload && (
          <ActionButton
            loading={downloading}
            variant="outline"
            onClick={() => void download()}
          >
            Export chart
          </ActionButton>
        )
      }
    >
      <div className="space-y-5">
        {onFilterChange && (
          <MetricsFilterBar
            filters={filters}
            value={filterValues}
            onValueChange={onFilterChange}
          />
        )}{" "}
        {(error || failure) && (
          <Banner title="Metrics need attention" tone="danger">
            {error || failure}
          </Banner>
        )}
        {loading ? (
          <div role="status" aria-label="Loading metrics">
            <Skeleton className="h-52 w-full" />
          </div>
        ) : empty ? (
          <p className="py-12 text-center text-muted-foreground">
            No activity in this period. Try another date range.
          </p>
        ) : (
          <div className="min-w-0">{children}</div>
        )}
      </div>
    </Card>
  );
}
export function ModalAddEmployeeSuccess({
  employees,
  onAddAnother,
  onAddToProgram,
  ...props
}: Omit<ModalProps, "title" | "description" | "children"> & {
  employees: { id: string; name: string }[];
  onAddAnother: () => void;
  onAddToProgram?: () => void;
}) {
  return (
    <Modal
      {...props}
      title="Employees added"
      description={`${employees.length} employees are ready.`}
      footer={
        <>
          <Button variant="outline" onClick={onAddAnother}>
            Add another
          </Button>
          <Button onClick={() => props.onOpenChange(false)}>Done</Button>
        </>
      }
    >
      <ul className="mb-5 list-disc space-y-2 pl-5">
        {employees.map((e) => (
          <li key={e.id}>{e.name}</li>
        ))}
      </ul>
      {onAddToProgram && (
        <Button onClick={onAddToProgram}>Add to programs</Button>
      )}
    </Modal>
  );
}
export function ModalProgramConfirmation({
  programs,
  ...props
}: Omit<ModalProps, "title" | "description" | "children"> & {
  programs: {
    id: string;
    name: string;
    description?: string;
    onOpen: () => void;
  }[];
}) {
  return (
    <Modal
      {...props}
      title="Program created"
      description="Review and configure your new programs."
      footer={<Button onClick={() => props.onOpenChange(false)}>Done</Button>}
    >
      <div className="space-y-3">
        {programs.map((p) => (
          <CardNextButton
            key={p.id}
            title={p.name}
            description={p.description}
            onClick={p.onOpen}
          />
        ))}
      </div>
    </Modal>
  );
}
export interface SyncRecord {
  id: string;
  label: string;
  status: "complete" | "running" | "failed";
  message?: string;
  rows: { id: string; name: string; change: string }[];
}
export function ModalSyncHistory({
  records,
  selected,
  onSelect,
  ...props
}: Omit<ModalProps, "title" | "description" | "children"> & {
  records: SyncRecord[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const record = records.find((r) => r.id === selected);
  return (
    <Modal
      {...props}
      title="Sync history"
      description="Review changes from each synchronization."
      className="max-w-3xl"
    >
      <div className="space-y-5">
        <SelectField
          label="Sync record"
          value={selected}
          onValueChange={onSelect}
          options={records.map((r) => ({ value: r.id, label: r.label }))}
        />
        {record ? (
          <>
            <Banner
              title={
                record.status === "running"
                  ? "Sync in progress"
                  : record.status === "failed"
                    ? "Sync failed"
                    : "Sync complete"
              }
              tone={
                record.status === "failed"
                  ? "danger"
                  : record.status === "running"
                    ? "info"
                    : "success"
              }
            >
              {record.message}
            </Banner>
            <DataTable
              rows={record.rows}
              columns={[
                { id: "name", header: "Employee", cell: (r) => r.name },
                { id: "change", header: "Change", cell: (r) => r.change },
              ]}
              caption="Synchronization changes"
              getRowId={(r) => r.id}
              getRowLabel={(r) => r.name}
            />
          </>
        ) : (
          <p>No sync records yet.</p>
        )}
      </div>
    </Modal>
  );
}
export interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  employeeId: string;
  birthday: string;
  hireDate: string;
  launchDate: string;
  pointsReceived: number;
  pointsSpent: number;
  programs: string[];
}
export function ViewEmployee({
  employee,
  history = [],
  roles,
  onSave,
  onChangeRole,
  onSendPoints,
  onAddToProgram,
  onRemove,
  integrated = false,
}: {
  employee: EmployeeProfile;
  history?: { id: string; date: string; description: string; points: number }[];
  roles: { value: string; label: string }[];
  onSave: (values: FormValues) => void | Promise<void>;
  onChangeRole: (role: string) => void;
  onSendPoints: () => void;
  onAddToProgram: () => void;
  onRemove: () => void;
  integrated?: boolean;
}) {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{employee.name}</h2>
          <p className="text-sm text-muted-foreground">{employee.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onSendPoints}>Send points</Button>
          <Button variant="outline" onClick={onAddToProgram}>
            Add to programs
          </Button>
          <Button variant="outline" onClick={onRemove} disabled={integrated}>
            Remove employee
          </Button>
        </div>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Points">
          <SettingsTable
            rows={[
              {
                id: "received",
                label: "Received",
                value: employee.pointsReceived,
              },
              { id: "spent", label: "Spent", value: employee.pointsSpent },
              {
                id: "remaining",
                label: "Remaining",
                value: employee.pointsReceived - employee.pointsSpent,
              },
            ]}
          />
        </Card>
        <Card title="Membership">
          <SelectField
            label="Role"
            value={employee.role}
            onValueChange={onChangeRole}
            options={roles}
            disabled={integrated}
          />
          <p className="mt-4 text-sm">
            Programs: {employee.programs.join(", ") || "None"}
          </p>
        </Card>
      </div>
      <Form
        title="Employee details"
        defaultValues={{
          department: employee.department,
          employeeId: employee.employeeId,
          birthday: employee.birthday,
          hireDate: employee.hireDate,
          launchDate: employee.launchDate,
        }}
        fields={[
          { name: "department", label: "Department" },
          { name: "employeeId", label: "Employee ID" },
          { name: "birthday", label: "Birthdate", type: "date" },
          { name: "hireDate", label: "Hire date", type: "date" },
          { name: "launchDate", label: "Launch date", type: "date" },
        ]}
        onSubmit={onSave}
      />
      <DataTable
        caption="Point history"
        rows={history}
        columns={[
          {
            id: "date",
            header: "Date",
            sortValue: (r) => r.date,
            cell: (r) => r.date,
          },
          { id: "description", header: "Activity", cell: (r) => r.description },
          { id: "points", header: "Points", cell: (r) => r.points },
        ]}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.description}
      />
    </div>
  );
}
export function ViewProgram({
  name,
  autoEnroll,
  onAutoEnrollChange,
  onSave,
  onRemove,
  employees,
  defaultValues = {},
}: {
  name: string;
  autoEnroll: boolean;
  onAutoEnrollChange: (value: boolean) => void;
  onSave: (values: FormValues) => void | Promise<void>;
  onRemove: () => void;
  employees: { id: string; name: string; points: number }[];
  defaultValues?: FormValues;
}) {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">{name}</h2>
        <Button variant="outline" onClick={onRemove}>
          Remove program
        </Button>
      </header>
      <AdminMetricsBar engaged={employees.length} total={employees.length} />
      <SwitchField
        label="Automatically enroll new employees"
        checked={autoEnroll}
        onCheckedChange={onAutoEnrollChange}
      />
      <Form
        title="Program details"
        defaultValues={{ name, ...defaultValues }}
        fields={[
          { name: "name", label: "Program name", required: true },
          {
            name: "type",
            label: "Program type",
            type: "select",
            options: [
              { value: "launch", label: "Launch" },
              { value: "event", label: "Event" },
              { value: "recurring", label: "Recurring" },
            ],
          },
          {
            name: "event",
            label: "Event",
            type: "select",
            options: [
              { value: "birthday", label: "Birthday" },
              { value: "anniversary", label: "Work anniversary" },
            ],
            when: (v) => v.type === "event",
          },
          {
            name: "day",
            label: "Recurring day",
            type: "number",
            min: 1,
            max: 28,
            when: (v) => v.type === "recurring",
          },
          {
            name: "amount",
            label: "Points per employee",
            type: "number",
            min: 1,
            required: true,
          },
          { name: "startDate", label: "Start date", type: "date" },
          {
            name: "endDate",
            label: "End date",
            type: "date",
            validate: (v, values) =>
              v && String(v) < String(values.startDate)
                ? "End date must follow start date."
                : undefined,
          },
          { name: "message", label: "Distribution message", type: "textarea" },
        ]}
        onSubmit={onSave}
      />
      <DataTable
        caption="Program employees"
        rows={employees}
        columns={[
          {
            id: "name",
            header: "Employee",
            cell: (r) => r.name,
            sortValue: (r) => r.name,
          },
          { id: "points", header: "Points", cell: (r) => r.points },
        ]}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
      />
    </div>
  );
}
