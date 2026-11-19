import { useId, useState, type ComponentProps, type ReactNode } from 'react';
import { Check, Minus } from 'lucide-react';
import { TextField, SelectField, RadioCards, Checklist, type SelectOption } from './fields';
import { SearchSelect } from './advanced-fields';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Banner } from './feedback';

export interface PasswordRule {
  label: string;
  test: (value: string) => boolean;
}

export const defaultPasswordRules: PasswordRule[] = [
  { label: 'At least 12 characters', test: (v) => v.length >= 12 },
  {
    label: 'An uppercase and lowercase letter',
    test: (v) => /[A-Z]/.test(v) && /[a-z]/.test(v),
  },
  { label: 'A number', test: (v) => /\d/.test(v) },
];

export function PasswordHelper({
  value,
  rules = defaultPasswordRules,
}: {
  value: string;
  rules?: PasswordRule[];
}) {
  return (
    <ul aria-label="Password requirements" className="space-y-2 text-xs">
      {rules.map((rule) => {
        const met = rule.test(value);
        const Icon = met ? Check : Minus;

        return (
          <li key={rule.label} className="flex gap-2">
            <Icon aria-hidden className="size-4 shrink-0" />
            <span>
              {rule.label}
              <span className="sr-only">{met ? ' — met' : ' — not met'}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function PasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: (visible: boolean) => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-pressed={visible}
      aria-label={visible ? 'Hide password' : 'Show password'}
      onClick={() => onToggle(!visible)}
    >
      {visible ? 'Hide' : 'Show'}
    </Button>
  );
}

export function PasswordField({
  rules,
  showRequirements = false,
  ...props
}: Omit<ComponentProps<typeof TextField>, 'type' | 'trailingAction'> & {
  rules?: PasswordRule[];
  showRequirements?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-3">
      <TextField
        {...props}
        type={visible ? 'text' : 'password'}
        trailingAction={<PasswordToggle visible={visible} onToggle={setVisible} />}
      />
      {showRequirements && <PasswordHelper value={String(props.value ?? '')} rules={rules} />}
    </div>
  );
}

export function TextareaField({
  label,
  hint,
  error,
  value,
  onChange,
  maxLength = 500,
  ...props
}: Omit<ComponentProps<typeof Textarea>, 'value' | 'onChange'> & {
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();

  return (
    <div className="space-y-2">
      <label htmlFor={props.id ?? id} className="text-sm font-medium">
        {label}
      </label>
      <Textarea
        {...props}
        id={props.id ?? id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={`${id}-note`}
      />
      <div id={`${id}-note`} className="flex justify-between gap-3 text-xs text-muted-foreground">
        <span className={error ? 'text-destructive' : undefined}>{error ?? hint}</span>
        <span>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

export function DatePicker(props: Omit<ComponentProps<typeof TextField>, 'type'>) {
  return <TextField {...props} type="date" />;
}

export function Phone(props: Omit<ComponentProps<typeof TextField>, 'type'>) {
  return (
    <TextField
      {...props}
      type="tel"
      autoComplete="tel"
      placeholder={props.placeholder ?? '+1 602 555 0123'}
    />
  );
}

export interface AddressValue {
  street: string;
  street2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export const emptyAddress: AddressValue = {
  street: '',
  street2: '',
  city: '',
  region: '',
  postalCode: '',
  country: 'US',
};

export function Address({
  value,
  onValueChange,
  disabled = false,
  loadSuggestions,
  resolveSuggestion,
  countries = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
  ],
}: {
  value: AddressValue;
  onValueChange: (value: AddressValue) => void;
  disabled?: boolean;
  countries?: SelectOption[];
  loadSuggestions?: (query: string, signal: AbortSignal) => Promise<SelectOption[]>;
  resolveSuggestion?: (id: string) => Promise<AddressValue>;
}) {
  const [lookupError, setLookupError] = useState('');
  const [lookingUp, setLookingUp] = useState(false);

  async function select(id: string) {
    if (!resolveSuggestion) return;
    setLookingUp(true);
    setLookupError('');
    try {
      onValueChange(await resolveSuggestion(id));
    } catch {
      setLookupError('Address lookup failed. Enter the address below.');
    } finally {
      setLookingUp(false);
    }
  }

  return (
    <fieldset disabled={disabled || lookingUp} className="space-y-4">
      <legend className="mb-4 text-sm font-semibold">Address</legend>
      {loadSuggestions && resolveSuggestion && (
        <SearchSelect
          label="Find an address"
          value={null}
          onValueChange={(v) => {
            if (v && !Array.isArray(v)) void select(v.value);
          }}
          loadOptions={loadSuggestions}
          disabled={disabled || lookingUp}
        />
      )}{' '}
      {lookingUp && <p role="status">Loading address…</p>}
      {lookupError && (
        <p role="alert" className="text-sm text-destructive">
          {lookupError}
        </p>
      )}
      <SelectField
        label="Country / Region"
        value={value.country}
        options={countries}
        onValueChange={(country) => onValueChange({ ...value, country })}
        disabled={disabled || lookingUp}
      />
      {(
        [
          ['street', 'Street address', 'address-line1'],
          ['street2', 'Apartment, unit, suite', 'address-line2'],
          ['city', 'City', 'address-level2'],
          ['region', 'State / Province', 'address-level1'],
          ['postalCode', 'ZIP / Postal code', 'postal-code'],
        ] as const
      ).map(([key, label, autoComplete]) => (
        <TextField
          key={key}
          label={label}
          value={value[key]}
          autoComplete={autoComplete}
          required={key !== 'street2'}
          onChange={(e) => onValueChange({ ...value, [key]: e.target.value })}
        />
      ))}
    </fieldset>
  );
}

export function PointConversionInput({
  label = 'Amount',
  value,
  onValueChange,
  pointsPerUnit = 5,
  min = 0,
  max,
  disabled = false,
}: {
  label?: string;
  value: number;
  onValueChange: (value: number) => void;
  pointsPerUnit?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <TextField
      label={label}
      type="number"
      min={min}
      max={max}
      step={1}
      value={value}
      disabled={disabled}
      onChange={(e) => onValueChange(e.target.valueAsNumber || 0)}
      hint={
        pointsPerUnit > 0
          ? `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / pointsPerUnit)} equivalent`
          : 'Conversion unavailable'
      }
    />
  );
}

export function ListGroup({
  label,
  options,
  value,
  onValueChange,
  disabled = false,
}: {
  label: string;
  options: SelectOption[];
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  disabled?: boolean;
}) {
  return Array.isArray(value) ? (
    <Checklist
      label={label}
      options={options}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    />
  ) : (
    <fieldset disabled={disabled}>
      <RadioCards label={label} options={options} value={value} onValueChange={onValueChange} />
    </fieldset>
  );
}

/** A host for provider-owned secure fields. Card details never enter this component's state. */
export function CreditCardInput({
  children,
  complete = false,
  error,
  verification,
}: {
  children: ReactNode;
  complete?: boolean;
  error?: string;
  verification?: ReactNode;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-sm font-semibold">Credit card details</legend>
      <div className="rounded-lg border bg-card p-4">{children}</div>
      {verification}
      {error ? (
        <Banner title="Check payment details" tone="danger">
          {error}
        </Banner>
      ) : (
        <p role="status" className="text-xs text-muted-foreground">
          {complete ? 'Payment details complete' : 'Complete the secure payment fields.'}
        </p>
      )}
    </fieldset>
  );
}
