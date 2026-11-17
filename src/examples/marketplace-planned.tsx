import type { ImageFadeProps } from "../components/image-fade";
import { useEffect, useRef, useState } from "react";
import {
  AccountCard,
  AccountInformation,
  PaymentAccountCard,
  PaymentSelect,
  ProfileBilling,
  SMSCard,
  AdminIntegrations,
  type AccountOption,
  type Integration,
} from "../components/account-components";
import { Button } from "../components/ui/button";
import { Banner } from "../components/feedback";
import {
  FormUpdateAddress,
  CardInformation,
  FormAdditionalInformation,
  ReviewConfirmation,
} from "../components/form-compositions";
import { EmployeeImport, FormAddEmployee } from "../components/employee-import";
import { Cart, Checkout, type CartLine } from "../components/commerce";
import {
  ModalAddEmployeeSuccess,
  ModalProgramConfirmation,
  ModalSyncHistory,
  MetricsGraphWrapper,
  ViewEmployee,
  ViewProgram,
  type EmployeeProfile,
} from "../components/admin-views";
import {
  AppFrame,
  MainNavigation,
  SidebarMenu,
  MainFooter,
  Hero,
  SplitScreen,
} from "../components/marketplace-layout";
import { ErrorBoundary } from "../components/foundation-primitives";
import { FormLogin } from "../components/form-recipes";
import {
  PasswordField,
  Address,
  emptyAddress,
  PointConversionInput,
  ListGroup,
  TextareaField,
  CreditCardInput,
} from "../components/specialized-fields";
import { Form, type FormValues } from "../components/recipe-form";
import type { TableFilterValue } from "../components/table-tools";
import { TextField, SwitchField } from "../components/fields";
import { assets } from "./assets";
export const demoAccounts: AccountOption[] = [
  { id: "studio", name: "Studio points", type: "points", balance: 2400 },
  {
    id: "visa",
    name: "Studio Visa",
    type: "card",
    lastFour: "4242",
    brand: "visa",
    isDefault: true,
  },
  { id: "invoice", name: "Monthly invoice", type: "invoice" },
];
export const demoCart: CartLine[] = [
  {
    id: "prints",
    title: "Art print collection",
    vendor: "D.G Studio",
    points: 125,
    quantity: 2,
    image: assets[0].src,
    rebate: 10,
    frequency: "once",
    frequencies: [
      { value: "once", label: "One time" },
      { value: "month", label: "Every month" },
    ],
  },
  {
    id: "archive",
    title: "Retired collection",
    vendor: "Studio archive",
    points: 200,
    quantity: 1,
    available: false,
  },
];
export function AccountDemo() {
  const [selected, setSelected] = useState("visa"),
    [note, setNote] = useState("");
  return (
    <div className="max-w-xl space-y-5">
      <AccountCard account={demoAccounts[0]} />
      <PaymentAccountCard
        account={demoAccounts[1]}
        menu={[
          {
            id: "rename",
            label: "Rename",
            onSelect: () => setNote("Rename selected"),
          },
          {
            id: "default",
            label: "Set default",
            onSelect: () => setNote("Default payment method updated"),
          },
        ]}
      />
      <PaymentSelect
        accounts={demoAccounts}
        value={selected}
        onValueChange={setSelected}
        onAddPayment={() => setNote("Add payment method selected")}
      />
      <p role="status" className="text-sm">
        {note ||
          `Selected: ${demoAccounts.find((a) => a.id === selected)?.name}`}
      </p>
    </div>
  );
}
export function BillingDemo() {
  const [twoFactor, setTwoFactor] = useState(true),
    [optedIn, setOptedIn] = useState(false),
    [note, setNote] = useState("");
  return (
    <div className="max-w-3xl space-y-5">
      <ProfileBilling
        onAddPayment={() => setNote("Add payment method selected")}
        account={
          <AccountInformation
            company="D.G Studio"
            linkedAccounts={["Studio workspace"]}
            twoFactor={twoFactor}
            onTwoFactorChange={setTwoFactor}
            onChangePassword={() => setNote("Change password selected")}
            onEditLinkedAccounts={() =>
              setNote("Edit linked accounts selected")
            }
          />
        }
        payments={demoAccounts
          .filter((a) => a.type === "card")
          .map((a) => (
            <PaymentAccountCard key={a.id} account={a} />
          ))}
      >
        <SMSCard
          phone="+1 602 555 0123"
          optedIn={optedIn}
          onOptIn={() => setOptedIn(true)}
          onOptOut={() => setOptedIn(false)}
        />
      </ProfileBilling>
      <p role="status">{note}</p>
    </div>
  );
}
export function IntegrationDemo() {
  const [status, setStatus] = useState<Integration["status"]>("disconnected"),
    [note, setNote] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className="max-w-2xl space-y-4">
      <AdminIntegrations
        integrations={[
          {
            id: "hris",
            name: "People directory",
            description: "Keep employee records aligned with your directory.",
            status,
            onConnect: () => setStatus("connected"),
            onDisconnect: () => setStatus("disconnected"),
            onSync: () => {
              setStatus("syncing");
              timer.current = setTimeout(() => {
                setStatus("connected");
                setNote("12 employee records synchronized in this preview.");
              }, 500);
            },
            onHistory: () => setNote("Last sync: 12 records updated."),
          },
        ]}
      />
      <p role="status" className="text-sm">
        {note}
      </p>
    </div>
  );
}
export function CommerceDemo() {
  const [items, setItems] = useState(demoCart),
    [stage, setStage] = useState("cart");
  return (
    <div className="mx-auto max-w-2xl">
      {stage === "cart" ? (
        <Cart
          items={items}
          onItemsChange={setItems}
          onCheckout={(available) => {
            setItems(available);
            setStage("checkout");
          }}
          onContinueShopping={() => {
            setItems(demoCart);
            setStage("cart");
          }}
        />
      ) : (
        <Checkout
          items={items}
          paymentMethods={demoAccounts}
          onSubmit={async () => {
            await new Promise((r) => setTimeout(r, 450));
            return { orderId: "DEMO-1042" };
          }}
          onClose={() => {
            setItems(demoCart);
            setStage("cart");
          }}
        />
      )}
      <p className="mt-5 text-xs text-muted-foreground">
        Local checkout preview. No purchase or payment is submitted.
      </p>
    </div>
  );
}
export function CheckoutDemo() {
  return (
    <div className="max-w-2xl">
      <Checkout
        items={demoCart}
        paymentMethods={demoAccounts}
        onSubmit={async () => ({ orderId: "DEMO-1042" })}
        onClose={() => {}}
      />
    </div>
  );
}
export function EmployeeImportDemo() {
  return (
    <div className="max-w-3xl">
      <FormAddEmployee
        onSubmit={async () => {
          await new Promise((r) => setTimeout(r, 300));
        }}
      />
    </div>
  );
}
export function CsvImportDemo() {
  return (
    <div className="max-w-3xl">
      <EmployeeImport
        onSubmit={async () => {
          await new Promise((r) => setTimeout(r, 300));
        }}
      />
    </div>
  );
}
export function PaymentFieldsDemo() {
  const [complete, setComplete] = useState(false);
  return (
    <div className="max-w-lg">
      <CardInformation
        complete={complete}
        secureFields={
          <div className="space-y-3">
            <p className="text-sm">Payment-provider field slot</p>
            <p className="text-xs text-muted-foreground">
              Demo Visa ending 4242
            </p>
            <SwitchField
              label="Demo payment fields complete"
              checked={complete}
              onCheckedChange={setComplete}
            />
          </div>
        }
        onCreatePaymentMethod={async () => {
          await new Promise((r) => setTimeout(r, 250));
          return "demo-payment-method";
        }}
        onSubmit={() => {}}
      />
    </div>
  );
}
export function AddressDemo() {
  const [value, setValue] = useState(emptyAddress);
  return (
    <div className="max-w-lg">
      <Address value={value} onValueChange={setValue} />
    </div>
  );
}
export function UpdateAddressDemo() {
  return (
    <div className="max-w-lg">
      <FormUpdateAddress onSubmit={() => {}} />
    </div>
  );
}
export function PasswordDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="max-w-md">
      <PasswordField
        label="New password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="new-password"
        showRequirements
      />
    </div>
  );
}
export function TextareaDemo() {
  const [value, setValue] = useState("A warm, thoughtful note.");
  return (
    <div className="max-w-md">
      <TextareaField
        label="Message"
        value={value}
        onChange={setValue}
        maxLength={180}
      />
    </div>
  );
}
export function PointConversionDemo() {
  const [value, setValue] = useState(250);
  return (
    <div className="max-w-md">
      <PointConversionInput value={value} onValueChange={setValue} />
    </div>
  );
}
export function ListGroupDemo() {
  const [value, setValue] = useState<string | string[]>(["design"]);
  return (
    <ListGroup
      label="Interests"
      value={value}
      onValueChange={setValue}
      options={[
        { value: "design", label: "Design" },
        { value: "photography", label: "Photography" },
        { value: "film", label: "Film" },
      ]}
    />
  );
}
export function AdditionalInfoDemo() {
  return (
    <div className="max-w-xl">
      <FormAdditionalInformation
        groups={[
          {
            id: "print",
            title: "Art print",
            questions: [
              {
                id: "name",
                label: "Recipient name",
                type: "text",
                required: true,
                sharedKey: "recipient",
              },
            ],
          },
          {
            id: "book",
            title: "Photo book",
            questions: [
              {
                id: "name",
                label: "Recipient name",
                type: "text",
                required: true,
                sharedKey: "recipient",
              },
            ],
          },
        ]}
        onSubmit={() => {}}
      />
    </div>
  );
}
export function ReviewDemo() {
  const [complete, setComplete] = useState(false);
  return (
    <div className="max-w-lg">
      {complete ? (
        <Banner title="Transfer confirmed" tone="success" />
      ) : (
        <ReviewConfirmation
          title="Review point transfer"
          items={[
            { label: "From", value: "Studio account" },
            { label: "To", value: "Team account" },
            { label: "Amount", value: "250 points" },
            { label: "Fee", value: 0 },
          ]}
          onConfirm={() => setComplete(true)}
          onBack={() => setComplete(false)}
        />
      )}
    </div>
  );
}
export function SuccessModalDemo() {
  const [kind, setKind] = useState("");
  return (
    <div className="flex gap-3">
      <Button onClick={() => setKind("employees")}>Employee success</Button>
      <Button variant="outline" onClick={() => setKind("program")}>
        Program success
      </Button>
      <ModalAddEmployeeSuccess
        open={kind === "employees"}
        onOpenChange={(open) => {
          if (!open) setKind("");
        }}
        employees={[
          { id: "1", name: "Maya Chen" },
          { id: "2", name: "Sam Rivera" },
        ]}
        onAddAnother={() => setKind("")}
        onAddToProgram={() => setKind("program")}
      />
      <ModalProgramConfirmation
        open={kind === "program"}
        onOpenChange={(open) => {
          if (!open) setKind("");
        }}
        programs={[
          {
            id: "welcome",
            name: "Welcome program",
            description: "250 points on joining",
            onOpen: () => setKind(""),
          },
        ]}
      />
    </div>
  );
}
export function SyncHistoryDemo() {
  const [open, setOpen] = useState(false),
    [selected, setSelected] = useState("recent");
  return (
    <>
      <Button onClick={() => setOpen(true)}>View sync history</Button>
      <ModalSyncHistory
        open={open}
        onOpenChange={setOpen}
        selected={selected}
        onSelect={setSelected}
        records={[
          {
            id: "recent",
            label: "November 16, 2026",
            status: "complete",
            message: "Two records updated.",
            rows: [
              { id: "1", name: "Maya Chen", change: "Department updated" },
              { id: "2", name: "Sam Rivera", change: "Employee added" },
            ],
          },
          {
            id: "older",
            label: "November 15, 2026",
            status: "failed",
            message: "Directory connection expired. Reconnect and try again.",
            rows: [],
          },
        ]}
      />
    </>
  );
}
export function MetricsDemo() {
  const [filters, setFilters] = useState<Record<string, TableFilterValue>>({}),
    [note, setNote] = useState("");
  const department = String(filters.department ?? "All");
  const points = department === "design" ? [35, 62, 78, 92] : [42, 70, 61, 85];
  return (
    <div className="max-w-3xl space-y-3">
      <MetricsGraphWrapper
        title="Employee engagement"
        filters={[
          {
            id: "department",
            label: "Department",
            type: "choice",
            options: [
              { value: "design", label: "Design" },
              { value: "engineering", label: "Engineering" },
            ],
          },
          { id: "date", label: "Period", type: "date" },
        ]}
        filterValues={filters}
        onFilterChange={setFilters}
        onDownload={() => setNote("Chart export requested by this preview.")}
      >
        <ul aria-label="Weekly engagement" className="space-y-4">
          {points.map((value, i) => (
            <li
              key={i}
              className="grid grid-cols-[60px_1fr_40px] items-center gap-3 text-sm"
            >
              <span>Week {i + 1}</span>
              <div className="h-5 rounded bg-muted">
                <div
                  className="h-full rounded bg-primary"
                  style={{ width: `${value}%` }}
                />
              </div>
              <span>{value}%</span>
            </li>
          ))}
        </ul>
      </MetricsGraphWrapper>
      <p role="status" className="text-sm">
        {note}
      </p>
    </div>
  );
}
const employee: EmployeeProfile = {
  id: "maya",
  name: "Maya Chen",
  email: "maya@example.com",
  role: "admin",
  department: "Design",
  employeeId: "DG-001",
  birthday: "1990-08-12",
  hireDate: "2024-04-15",
  launchDate: "2026-11-16",
  pointsReceived: 1250,
  pointsSpent: 450,
  programs: ["Welcome", "Recognition"],
};
export function EmployeeViewDemo() {
  const [profile, setProfile] = useState(employee),
    [note, setNote] = useState("");
  return (
    <div className="max-w-4xl space-y-4">
      <ViewEmployee
        employee={profile}
        roles={[
          { value: "admin", label: "Admin" },
          { value: "user", label: "Employee" },
        ]}
        onChangeRole={(role) => setProfile((p) => ({ ...p, role }))}
        onSave={(values) =>
          setProfile((p) => ({ ...p, ...values }) as EmployeeProfile)
        }
        onSendPoints={() => setNote("Send points selected")}
        onAddToProgram={() => setNote("Add to program selected")}
        onRemove={() => setNote("Remove employee selected")}
        history={[
          {
            id: "1",
            date: "2026-11-16",
            description: "Recognition points",
            points: 250,
          },
          {
            id: "2",
            date: "2026-11-10",
            description: "Art collection",
            points: -125,
          },
        ]}
      />
      <p role="status">{note}</p>
    </div>
  );
}
export function ProgramViewDemo() {
  const [auto, setAuto] = useState(true),
    [name, setName] = useState("Welcome program"),
    [note, setNote] = useState("");
  return (
    <div className="max-w-4xl space-y-4">
      <ViewProgram
        name={name}
        autoEnroll={auto}
        onAutoEnrollChange={setAuto}
        onSave={(v) => setName(String(v.name))}
        onRemove={() => setNote("Remove program selected")}
        defaultValues={{ type: "launch", amount: 250 }}
        employees={[
          { id: "1", name: "Maya Chen", points: 250 },
          { id: "2", name: "Sam Rivera", points: 250 },
        ]}
      />
      <p role="status">{note}</p>
    </div>
  );
}
export function HeroDemo({
  blurBg = true,
  aspectRatio = "4 / 3",
}: Pick<ImageFadeProps, "blurBg" | "aspectRatio"> = {}) {
  const [note, setNote] = useState("");
  return (
    <div className="max-w-5xl space-y-4">
      <Hero
        items={assets.slice(0, 3).map((a) => ({
          id: a.id,
          title: a.title,
          summary: `A study from the ${a.collection.toLowerCase()} collection.`,
          image: {
            src: a.src,
            alt: a.alt,
            width: a.width,
            height: a.height,
            blurBg,
            aspectRatio,
          },
        }))}
        onViewDetails={(item) => setNote(`${item.title} selected`)}
      />
      <p role="status">{note}</p>
    </div>
  );
}
export function AppFrameDemo() {
  const [view, setView] = useState("library"),
    [note, setNote] = useState("");
  const items = [
    { id: "library", label: "Library", onSelect: () => setView("library") },
    { id: "team", label: "Team", onSelect: () => setView("team") },
    { id: "settings", label: "Settings", onSelect: () => setView("settings") },
  ];
  return (
    <AppFrame
      navigation={
        <MainNavigation
          items={items.slice(0, 2)}
          active={view}
          gifts={[
            {
              id: "gift",
              name: "Print collection",
              vendor: "D.G Studio",
              seen: false,
              expires: "November 30, 2026",
              image: assets[0].src,
            },
          ]}
          onGiftSelect={() => setNote("Gift selected")}
        />
      }
      sidebar={
        <SidebarMenu
          items={[
            ...items,
            {
              id: "admin",
              label: "Administration",
              children: [
                {
                  id: "programs",
                  label: "Programs",
                  onSelect: () => setView("programs"),
                },
                {
                  id: "billing",
                  label: "Billing",
                  onSelect: () => setView("billing"),
                },
              ],
            },
          ]}
          active={view}
        />
      }
      footer={
        <MainFooter
          links={[
            {
              label: "Component catalog",
              href: "./?path=/story/source-catalog-marketplace--inventory",
            },
          ]}
        >
          D.G Studio
        </MainFooter>
      }
    >
      <h1 className="text-2xl font-semibold">
        {view[0].toUpperCase() + view.slice(1)}
      </h1>
      <p className="my-4 text-sm text-muted-foreground">
        A responsive frame for your next workspace.
      </p>
      {view === "library" && <HeroDemo />}
      <p role="status">{note}</p>
    </AppFrame>
  );
}
export function SplitScreenDemo() {
  return (
    <SplitScreen
      image={assets[0]}
      footer={
        <p className="text-xs text-muted-foreground">
          Your workspace, ready when you are.
        </p>
      }
    >
      <FormLogin onSubmit={() => {}} />
    </SplitScreen>
  );
}
function FragileView() {
  const [fail, setFail] = useState(false);
  if (fail) throw new Error("Intentional preview error");
  return <Button onClick={() => setFail(true)}>Trigger preview error</Button>;
}
export function ErrorBoundaryDemo() {
  return (
    <ErrorBoundary>
      <FragileView />
    </ErrorBoundary>
  );
}
export function GenericFormDemo() {
  const [message, setMessage] = useState("");
  return (
    <div className="max-w-md space-y-4">
      <Form
        title="Collection details"
        fields={[
          { name: "name", label: "Name", required: true },
          {
            name: "email",
            label: "Owner email",
            type: "email",
            required: true,
          },
        ]}
        onSubmit={(v) => setMessage(`${v.name} saved`)}
      />
      <p role="status">{message}</p>
    </div>
  );
}
export function SecureFieldHostDemo() {
  const [complete, setComplete] = useState(false);
  return (
    <CreditCardInput complete={complete}>
      <SwitchField
        label="Demo provider completion"
        checked={complete}
        onCheckedChange={setComplete}
      />
    </CreditCardInput>
  );
}
export function ImportSummaryDemo() {
  const [note, setNote] = useState("");
  return (
    <div>
      <TextField label="Preview name" defaultValue="Employee import" />
      <Button onClick={() => setNote("Review requested")}>Review</Button>
      <p role="status">{note}</p>
    </div>
  );
}
export function savePreview(_values: FormValues) {
  return new Promise<void>((resolve) => setTimeout(resolve, 250));
}
