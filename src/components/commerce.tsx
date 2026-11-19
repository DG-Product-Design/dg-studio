import { useState, type ReactNode } from 'react';
import { ShoppingBag, CheckCircle2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { ActionButton } from './action-button';
import { TextField, SelectField } from './fields';
import { Banner } from './feedback';
import { FormWizard, type WizardStep } from './form-wizard';
import { Address, emptyAddress, type AddressValue } from './specialized-fields';
import { PaymentSelect, type AccountOption } from './account-components';
import { ImageFade } from './image-fade';

export interface CartLine {
  id: string;
  title: string;
  vendor: string;
  image?: string;
  points: number;
  quantity: number;
  available?: boolean;
  rebate?: number;
  frequency?: string;
  frequencies?: { value: string; label: string }[];
  maxQuantity?: number;
}

export function CartItem({
  item,
  onChange,
  onRemove,
  busy = false,
  readOnly = false,
}: {
  item: CartLine;
  onChange: (item: CartLine) => void;
  onRemove: () => void;
  busy?: boolean;
  readOnly?: boolean;
}) {
  return (
    <article
      aria-label={item.title}
      aria-busy={busy}
      className="space-y-4 rounded-xl border bg-card p-4"
    >
      <div className="flex items-start gap-4">
        {item.image && (
          <div className="w-16 shrink-0">
            <ImageFade src={item.image} alt="" width={1} height={1} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{item.vendor}</p>
          <h3 className="mt-1 font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm tabular-nums">
            {new Intl.NumberFormat().format(item.points * item.quantity)} points
          </p>
          {!!item.rebate && (
            <p className="text-xs text-primary">{item.rebate * item.quantity} points back</p>
          )}
          {item.available === false && (
            <p className="text-sm text-destructive">Unavailable — excluded from checkout</p>
          )}
        </div>
        {!readOnly && (
          <Button
            size="icon-sm"
            variant="ghost"
            disabled={busy}
            aria-label={`Remove ${item.title}`}
            onClick={onRemove}
          >
            <Trash2 aria-hidden />
          </Button>
        )}
      </div>
      {busy && (
        <p role="status" className="text-sm">
          Updating item…
        </p>
      )}
      <div className="flex flex-wrap items-end gap-4">
        {readOnly ? (
          <p className="text-sm">Quantity: {item.quantity}</p>
        ) : (
          <TextField
            label={`Quantity for ${item.title}`}
            type="number"
            min={1}
            max={item.maxQuantity ?? 99}
            value={item.quantity}
            disabled={busy || item.available === false}
            className="w-28"
            onChange={(e) => {
              const n = e.target.valueAsNumber;
              if (Number.isInteger(n) && n >= 1 && n <= (item.maxQuantity ?? 99))
                onChange({ ...item, quantity: n });
            }}
          />
        )}
        {item.frequencies?.length ? (
          readOnly ? (
            <p className="text-sm">
              {item.frequencies.find((f) => f.value === item.frequency)?.label}
            </p>
          ) : (
            <SelectField
              label={`Repeat ${item.title}`}
              value={item.frequency ?? item.frequencies[0].value}
              onValueChange={(frequency) => onChange({ ...item, frequency })}
              options={item.frequencies}
              disabled={busy || item.available === false}
            />
          )
        ) : null}
      </div>
    </article>
  );
}

export function CartSummary({
  items,
  feePoints = 0,
  pointsPerUnit = 5,
  children,
}: {
  items: CartLine[];
  feePoints?: number;
  pointsPerUnit?: number;
  children?: ReactNode;
}) {
  const available = items.filter((i) => i.available !== false);
  const subtotal = available.reduce((sum, i) => sum + i.points * i.quantity, 0);
  const rebate = available.reduce((sum, i) => sum + (i.rebate ?? 0) * i.quantity, 0);

  const total = subtotal + feePoints;

  return (
    <section className="space-y-4 rounded-xl border bg-card p-5" aria-label="Order summary">
      <h3 className="font-semibold">Order summary</h3>
      <dl className="space-y-3 text-sm">
        {[
          ['Subtotal', subtotal],
          ['Fees', feePoints],
          ['Total', total],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt>{label}</dt>
            <dd className="font-medium tabular-nums">
              {new Intl.NumberFormat().format(Number(value))} points
            </dd>
          </div>
        ))}
      </dl>
      {pointsPerUnit > 0 && (
        <p className="text-sm text-muted-foreground">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(total / pointsPerUnit)}{' '}
          equivalent
        </p>
      )}
      {rebate > 0 && <p className="text-sm text-primary">{rebate} points back on this order</p>}
      {children}
    </section>
  );
}

export function CartFooter({
  onCheckout,
  onContinueShopping,
  disabled = false,
  busy = false,
  remainingPoints,
}: {
  onCheckout: () => void;
  onContinueShopping: () => void;
  disabled?: boolean;
  busy?: boolean;
  remainingPoints?: number;
}) {
  return (
    <footer className="space-y-4 border-t pt-5">
      {remainingPoints !== undefined && (
        <p className="text-sm">
          Remaining balance: {new Intl.NumberFormat().format(remainingPoints)} points
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" disabled={busy} onClick={onContinueShopping}>
          Continue shopping
        </Button>
        <ActionButton loading={busy} disabled={disabled} onClick={onCheckout}>
          Checkout
        </ActionButton>
      </div>
    </footer>
  );
}

export function EmptyCart({ onBack }: { onBack: () => void }) {
  return (
    <section className="grid place-items-center gap-4 rounded-xl border border-dashed p-10 text-center">
      <ShoppingBag aria-hidden className="size-10 text-primary" />
      <h2 className="text-xl font-semibold">Your cart is empty</h2>
      <p className="text-sm text-muted-foreground">Choose something for your next project.</p>
      <Button onClick={onBack}>Back to shopping</Button>
    </section>
  );
}

export function Cart({
  items,
  onItemsChange,
  onCheckout,
  onContinueShopping,
  error,
  busy = false,
  feePoints = 0,
}: {
  items: CartLine[];
  onItemsChange: (items: CartLine[]) => void;
  onCheckout: (items: CartLine[]) => void;
  onContinueShopping: () => void;
  error?: string;
  busy?: boolean;
  feePoints?: number;
}) {
  if (!items.length) return <EmptyCart onBack={onContinueShopping} />;
  const available = items.filter((i) => i.available !== false);

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-semibold">
        Cart ({available.reduce((sum, i) => sum + i.quantity, 0)})
      </h2>
      {error && (
        <Banner title="Check your cart" tone="danger">
          {error}
        </Banner>
      )}
      {items.some((i) => i.available === false) && (
        <Banner title="Some items are unavailable" tone="warning">
          Unavailable items are excluded from the total and checkout.
        </Banner>
      )}
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          busy={busy}
          onChange={(updated) =>
            onItemsChange(items.map((i) => (i.id === updated.id ? updated : i)))
          }
          onRemove={() => onItemsChange(items.filter((i) => i.id !== item.id))}
        />
      ))}
      <CartSummary items={items} feePoints={feePoints} />
      <CartFooter
        busy={busy}
        disabled={!available.length}
        onContinueShopping={onContinueShopping}
        onCheckout={() => onCheckout(available)}
      />
    </section>
  );
}

export function CheckoutSummary(props: Parameters<typeof CartSummary>[0]) {
  return (
    <div className="space-y-4">
      {props.items
        .filter((i) => i.available !== false)
        .map((item) => (
          <CartItem key={item.id} item={item} readOnly onChange={() => {}} onRemove={() => {}} />
        ))}
      <CartSummary {...props} />
    </div>
  );
}

export interface CheckoutDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: AddressValue;
  paymentId: string;
}

export function CheckoutConfirmation({
  details,
  payment,
  items,
  onEdit,
}: {
  details: CheckoutDetails;
  payment?: AccountOption;
  items: CartLine[];
  onEdit?: () => void;
}) {
  return (
    <div className="space-y-5">
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Contact</dt>
          <dd>
            {details.firstName} {details.lastName}
            <br />
            {details.email}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Shipping</dt>
          <dd>
            {details.address.street}
            <br />
            {details.address.city}, {details.address.region} {details.address.postalCode}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Payment</dt>
          <dd>
            {payment?.name ?? 'Choose payment'} {payment?.lastFour && `•••• ${payment.lastFour}`}
          </dd>
        </div>
      </dl>
      {onEdit && (
        <Button type="button" variant="outline" onClick={onEdit}>
          Edit details
        </Button>
      )}
      <CartSummary items={items} />
    </div>
  );
}

export function CheckoutSuccess({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  return (
    <section className="space-y-5 rounded-xl border bg-card p-8 text-center">
      <CheckCircle2 aria-hidden className="mx-auto size-12 text-success" />
      <h2 className="text-2xl font-semibold">Order confirmed</h2>
      <p className="text-sm text-muted-foreground">Reference {orderId}</p>
      <Button onClick={onClose}>Continue browsing</Button>
    </section>
  );
}

export function Checkout({
  items,
  paymentMethods,
  onSubmit,
  onClose,
  additionalSteps = [],
}: {
  items: CartLine[];
  paymentMethods: AccountOption[];
  onSubmit: (value: CheckoutDetails, items: CartLine[]) => Promise<{ orderId: string }>;
  onClose: () => void;
  additionalSteps?: WizardStep[];
}) {
  const [details, setDetails] = useState<CheckoutDetails>({
    firstName: '',
    lastName: '',
    email: '',
    address: emptyAddress,
    paymentId:
      paymentMethods.find((p) => p.isDefault && !p.disabled)?.id ??
      paymentMethods.find((p) => !p.disabled)?.id ??
      '',
  });

  const [error, setError] = useState('');
  const [order, setOrder] = useState('');

  const available = items.filter((i) => i.available !== false);
  if (order) return <CheckoutSuccess orderId={order} onClose={onClose} />;
  if (!available.length) return <EmptyCart onBack={onClose} />;

  return (
    <FormWizard
      finishLabel="Place order"
      onComplete={async () => {
        if (!paymentMethods.some((p) => p.id === details.paymentId && !p.disabled))
          throw new Error('Choose an available payment method.');
        const result = await onSubmit(details, available);
        setOrder(result.orderId);
      }}
      steps={[
        {
          id: 'contact',
          label: 'Contact and shipping',
          validate: () => {
            const valid =
              !!details.firstName.trim() &&
              !!details.lastName.trim() &&
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email) &&
              !!details.address.street.trim() &&
              !!details.address.city.trim() &&
              !!details.address.region.trim() &&
              !!details.address.postalCode.trim();

            setError(valid ? '' : 'Complete your contact and shipping information.');

            return valid;
          },
          content: (
            <>
              {error && <Banner title={error} tone="danger" />}
              {(['firstName', 'lastName', 'email'] as const).map((key) => (
                <TextField
                  key={key}
                  label={
                    key === 'firstName'
                      ? 'First name'
                      : key === 'lastName'
                        ? 'Last name'
                        : 'Email address'
                  }
                  type={key === 'email' ? 'email' : 'text'}
                  value={details[key]}
                  onChange={(e) => setDetails((d) => ({ ...d, [key]: e.target.value }))}
                />
              ))}
              <Address
                value={details.address}
                onValueChange={(address) => setDetails((d) => ({ ...d, address }))}
              />
            </>
          ),
        },
        {
          id: 'payment',
          label: 'Payment',
          validate: () => {
            const valid = paymentMethods.some((p) => p.id === details.paymentId && !p.disabled);

            setError(valid ? '' : 'Choose an available payment method.');

            return valid;
          },
          content: (
            <>
              {error && <Banner title={error} tone="danger" />}
              <PaymentSelect
                accounts={paymentMethods}
                value={details.paymentId}
                onValueChange={(paymentId) => setDetails((d) => ({ ...d, paymentId }))}
              />
            </>
          ),
        },
        ...additionalSteps,
        {
          id: 'review',
          label: 'Review order',
          content: (
            <CheckoutConfirmation
              details={details}
              payment={paymentMethods.find((p) => p.id === details.paymentId)}
              items={available}
            />
          ),
        },
      ]}
    />
  );
}
