import { type ReactNode } from 'react';
import { Card, MetricTile } from './content';
import { CreditCard } from 'lucide-react';
import { Coin } from './coin';
import { Button } from './ui/button';
import { ActionButton } from './action-button';
import { NestedMenu, type MenuItem } from './menus';
import { SwitchField, RadioCards } from './fields';
import { Banner } from './feedback';

export interface AccountOption {
  id: string;
  name: string;
  type: 'points' | 'card' | 'invoice';
  balance?: number;
  lastFour?: string;
  brand?: string;
  disabled?: boolean;
  isDefault?: boolean;
}

export function AccountCard({ account }: { account: AccountOption }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
      {account.type === 'card' ? (
        <CreditCard aria-hidden className="size-10 shrink-0 text-muted-foreground" />
      ) : (
        <Coin size={40} />
      )}
      <div>
        <h3 className="font-semibold">{account.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {account.type === 'points'
            ? `${new Intl.NumberFormat().format(account.balance ?? 0)} points`
            : account.type === 'card'
              ? `•••• ${account.lastFour ?? '—'}`
              : 'Invoice account'}
        </p>
        {account.isDefault && <span className="text-xs text-primary">Default</span>}
      </div>
    </div>
  );
}

export function AccountSelect({
  accounts,
  value,
  onValueChange,
  label = 'Account',
}: {
  accounts: AccountOption[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
}) {
  return (
    <RadioCards
      label={label}
      value={value}
      onValueChange={onValueChange}
      options={accounts.map((a) => ({
        value: a.id,
        label: a.name,
        description:
          a.type === 'card'
            ? `Card ending ${a.lastFour ?? '—'}`
            : a.type === 'points'
              ? `${new Intl.NumberFormat().format(a.balance ?? 0)} points`
              : 'Pay by invoice',
        disabled: a.disabled,
      }))}
    />
  );
}

export function PaymentSelect({
  onAddPayment,
  ...props
}: Parameters<typeof AccountSelect>[0] & { onAddPayment?: () => void }) {
  return (
    <div className="space-y-4">
      <AccountSelect {...props} label={props.label ?? 'Payment method'} />
      {onAddPayment && (
        <Button type="button" variant="outline" onClick={onAddPayment}>
          Add payment method
        </Button>
      )}
    </div>
  );
}

export function PaymentAccountCard({
  account,
  menu = [],
  updating = false,
}: {
  account: AccountOption;
  menu?: MenuItem[];
  updating?: boolean;
}) {
  return (
    <div className="relative" aria-busy={updating}>
      <AccountCard account={account} />
      <div className="absolute right-3 top-3">
        {menu.length > 0 && !updating && <NestedMenu items={menu} />}
      </div>
      {updating && (
        <p role="status" className="p-2 text-xs">
          Updating payment account…
        </p>
      )}
    </div>
  );
}

export interface SettingRow {
  id: string;
  label: string;
  value: ReactNode;
  action?: { label: string; onClick: () => void; disabled?: boolean };
}

export function SettingsTable({ rows }: { rows: SettingRow[] }) {
  return (
    <dl className="divide-y">
      {rows.map((row) => (
        <div key={row.id} className="flex flex-wrap items-center gap-4 py-4">
          <dt className="w-40 text-sm font-medium">{row.label}</dt>
          <dd className="min-w-0 flex-1 break-words text-sm text-muted-foreground">{row.value}</dd>
          {row.action && (
            <dd>
              <Button
                type="button"
                size="sm"
                variant="outline"
                aria-label={`${row.action.label} ${row.label}`}
                disabled={row.action.disabled}
                onClick={row.action.onClick}
              >
                {row.action.label}
              </Button>
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}

export function AccountInformation({
  company,
  linkedAccounts,
  twoFactor,
  onTwoFactorChange,
  onChangePassword,
  onEditLinkedAccounts,
}: {
  company: string;
  linkedAccounts: string[];
  twoFactor: boolean;
  onTwoFactorChange: (enabled: boolean) => void;
  onChangePassword: () => void;
  onEditLinkedAccounts: () => void;
}) {
  return (
    <Card title="Account information">
      <SettingsTable
        rows={[
          { id: 'company', label: 'Company', value: company },
          {
            id: 'linked',
            label: 'Linked accounts',
            value: linkedAccounts.join(', ') || 'None',
            action: { label: 'Edit', onClick: onEditLinkedAccounts },
          },
          {
            id: 'password',
            label: 'Password',
            value: '••••••••',
            action: { label: 'Change', onClick: onChangePassword },
          },
        ]}
      />
      <SwitchField
        label="Two-factor authentication"
        checked={twoFactor}
        onCheckedChange={onTwoFactorChange}
      />
    </Card>
  );
}

export function SMSCard({
  phone,
  optedIn,
  busy = false,
  error,
  onOptIn,
  onOptOut,
}: {
  phone: string;
  optedIn: boolean;
  busy?: boolean;
  error?: string;
  onOptIn: () => void;
  onOptOut: () => void;
}) {
  return (
    <Card title="Text notifications">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {optedIn
            ? `Notifications enabled for ${phone}.`
            : 'Receive updates about your account by text.'}
        </p>
        {error && (
          <Banner title="Notification preference wasn’t saved" tone="danger">
            {error}
          </Banner>
        )}
        <ActionButton loading={busy} onClick={optedIn ? onOptOut : onOptIn}>
          {optedIn ? 'Turn off text notifications' : 'Enable text notifications'}
        </ActionButton>
      </div>
    </Card>
  );
}

export function ProfileBilling({
  account,
  payments,
  onAddPayment,
  children,
}: {
  account: ReactNode;
  payments: ReactNode;
  onAddPayment: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-6">
      {account}
      <Card
        title="Payment methods"
        action={
          <Button type="button" size="sm" onClick={onAddPayment}>
            Add payment method
          </Button>
        }
      >
        <div className="space-y-3">{payments}</div>
      </Card>
      {children}
    </div>
  );
}

export function AdminMetricsBar({
  engaged,
  total,
  utilized,
}: {
  engaged: number;
  total: number;
  utilized?: number;
}) {
  const percent = (count: number) =>
    total > 0 ? `${Math.round((count / total) * 100)}% of ${total}` : 'No eligible people yet';

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <MetricTile label="Engaged" value={engaged} description={percent(engaged)} />
      {utilized !== undefined && (
        <MetricTile label="Utilization" value={utilized} description={percent(utilized)} />
      )}
    </div>
  );
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  message?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
  onHistory?: () => void;
}

export function AdminIntegrations({ integrations }: { integrations: Integration[] }) {
  return (
    <div className="space-y-4">
      {integrations.length ? (
        integrations.map((i) => (
          <Card key={i.id} title={i.name} description={i.description}>
            <div className="space-y-4">
              <p role="status" className="text-sm">
                {i.status === 'syncing'
                  ? 'Syncing…'
                  : i.status === 'connected'
                    ? 'Connected'
                    : i.status === 'error'
                      ? 'Connection needs attention'
                      : 'Not connected'}
              </p>
              {i.message && (
                <Banner title={i.message} tone={i.status === 'error' ? 'danger' : 'info'} />
              )}
              <div className="flex flex-wrap gap-2">
                {i.status === 'disconnected' ? (
                  <Button onClick={i.onConnect}>Connect {i.name}</Button>
                ) : (
                  <>
                    <ActionButton loading={i.status === 'syncing'} onClick={i.onSync}>
                      Sync {i.name}
                    </ActionButton>
                    <Button
                      variant="outline"
                      disabled={i.status === 'syncing'}
                      onClick={i.onDisconnect}
                    >
                      Disconnect
                    </Button>
                  </>
                )}
                {i.onHistory && (
                  <Button variant="ghost" onClick={i.onHistory}>
                    View history
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))
      ) : (
        <p>No integrations configured.</p>
      )}
    </div>
  );
}
