import { useId, type ComponentProps, type ReactNode } from 'react';
import { Popover, Switch as SwitchPrimitive } from 'radix-ui';
import { ChevronDown } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Button } from './ui/button';
import { useTheme } from './theme';
import { cn } from '../lib/utils';

export interface FieldPresentation {
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
  className?: string;
  id?: string;
}

function FieldFrame({
  label,
  hint,
  error,
  hideLabel,
  className,
  id,
  children,
}: FieldPresentation & { id: string; children: ReactNode }) {
  return (
    <div className={cn('grid min-w-0 gap-2', className)}>
      <label htmlFor={id} className={cn('text-sm font-semibold', hideLabel && 'sr-only')}>
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function description(id: string, hint?: string, error?: string, existing?: string) {
  return (
    [existing, hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  );
}

export type TextFieldProps = ComponentProps<typeof Input> &
  FieldPresentation & {
    inputClassName?: string;
    leadingIcon?: ReactNode;
    trailingAction?: ReactNode;
  };

export function TextField({
  label,
  hint,
  error,
  hideLabel,
  className,
  inputClassName,
  leadingIcon,
  trailingAction,
  id: providedId,
  'aria-describedby': describedBy,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <FieldFrame {...{ label, hint, error, hideLabel, className, id }}>
      <div className="relative">
        {leadingIcon && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground [&>svg]:size-4"
          >
            {leadingIcon}
          </span>
        )}
        <Input
          {...props}
          id={id}
          aria-invalid={error ? true : props['aria-invalid']}
          aria-describedby={description(id, hint, error, describedBy)}
          className={cn(leadingIcon && 'pl-10', trailingAction && 'pr-20', inputClassName)}
        />
        {trailingAction && (
          <span className="absolute inset-y-0 right-1 flex items-center">{trailingAction}</span>
        )}
      </div>
    </FieldFrame>
  );
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectFieldProps extends FieldPresentation {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
}

export function SelectField({
  label,
  hint,
  error,
  hideLabel,
  className,
  id: providedId,
  options,
  value,
  onValueChange,
  placeholder = 'Choose an option',
  name,
  disabled,
  required,
}: SelectFieldProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <FieldFrame {...{ label, hint, error, hideLabel, className, id }}>
      <Select
        value={value}
        onValueChange={onValueChange}
        name={name}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger
          id={id}
          aria-invalid={!!error}
          aria-describedby={description(id, hint, error)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              textValue={option.label}
              description={option.description}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldFrame>
  );
}

export interface CheckboxFieldProps extends Omit<ComponentProps<'input'>, 'type'> {
  label: string;
  description?: string;
}

export function CheckboxField({
  label,
  description: hint,
  id: providedId,
  className,
  ...props
}: CheckboxFieldProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-start gap-3 text-sm has-disabled:cursor-not-allowed has-disabled:opacity-50',
        className,
      )}
    >
      <input
        {...props}
        id={id}
        type="checkbox"
        aria-describedby={description(id, hint, undefined, props['aria-describedby'])}
        className="mt-0.5 size-4 shrink-0 accent-primary"
      />
      <span>
        <span className="font-medium">{label}</span>
        {hint && (
          <span
            id={`${id}-hint`}
            className="mt-1 block text-xs leading-relaxed text-muted-foreground"
          >
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}

export function Checklist({
  label,
  options,
  value,
  onValueChange,
  name,
  disabled = false,
}: {
  label: string;
  options: SelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  name?: string;
  disabled?: boolean;
}) {
  return (
    <fieldset disabled={disabled} className="space-y-4">
      <legend className="mb-4 text-sm font-semibold">{label}</legend>
      {options.map((option) => (
        <CheckboxField
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          description={option.description}
          disabled={option.disabled}
          checked={value.includes(option.value)}
          onChange={(e) =>
            onValueChange(
              e.target.checked ? [...value, option.value] : value.filter((v) => v !== option.value),
            )
          }
        />
      ))}
    </fieldset>
  );
}

export function MultiSelectField({
  label,
  hint,
  error,
  className,
  id: providedId,
  options,
  value,
  onValueChange,
  name,
  disabled = false,
}: FieldPresentation & {
  options: SelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  name?: string;
  disabled?: boolean;
}) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const theme = useTheme();
  const selected = options.filter((o) => value.includes(o.value));

  return (
    <FieldFrame {...{ label, hint, error, className, id }}>
      {name &&
        value.map((v) => <input key={v} type="hidden" name={name} value={v} disabled={disabled} />)}
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={description(id, hint, error)}
            className="h-auto min-h-9 justify-between whitespace-normal text-left"
          >
            <span>
              {selected.length ? selected.map((o) => o.label).join(', ') : 'Choose options'}
            </span>
            <ChevronDown aria-hidden className="size-4 shrink-0" />
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            data-theme={theme}
            aria-label={label}
            sideOffset={6}
            align="start"
            className="bg-background text-foreground font-sans z-[70] w-80 max-w-[calc(100vw-2rem)] rounded-lg border p-5 shadow-xl"
          >
            <Checklist
              label={label}
              options={options}
              value={value}
              onValueChange={onValueChange}
            />
            <Popover.Close asChild>
              <Button type="button" className="mt-5 w-full" variant="secondary">
                Done
              </Button>
            </Popover.Close>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </FieldFrame>
  );
}

export function SwitchField({
  label,
  description: hint,
  id: providedId,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root> & {
  label: string;
  description?: string;
}) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <div className="flex items-center justify-between gap-5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {hint && (
          <span id={`${id}-hint`} className="mt-1 block font-normal text-muted-foreground">
            {hint}
          </span>
        )}
      </label>
      <SwitchPrimitive.Root
        {...props}
        id={id}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="h-6 w-11 shrink-0 rounded-full border border-input bg-muted p-0.5 data-[state=checked]:bg-primary disabled:opacity-50"
      >
        <SwitchPrimitive.Thumb className="block size-4 rounded-full bg-foreground transition-transform data-[state=checked]:translate-x-5 data-[state=checked]:bg-primary-foreground" />
      </SwitchPrimitive.Root>
    </div>
  );
}

export function RadioCards({
  label,
  options,
  value,
  onValueChange,
  name,
  disabled = false,
}: {
  label: string;
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
  disabled?: boolean;
}) {
  const group = useId();

  return (
    <fieldset disabled={disabled}>
      <legend className="mb-3 text-sm font-semibold">{label}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-start gap-3 rounded-lg border bg-card p-4 has-checked:border-primary has-checked:bg-primary/5 has-disabled:cursor-not-allowed has-disabled:opacity-50"
          >
            <input
              type="radio"
              name={name ?? group}
              value={option.value}
              checked={value === option.value}
              onChange={() => onValueChange(option.value)}
              disabled={option.disabled}
              className="mt-1 accent-primary"
            />
            <span className="text-sm">
              <span className="font-semibold">{option.label}</span>
              {option.description && (
                <span className="mt-1 block text-muted-foreground">{option.description}</span>
              )}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function RangeField({
  label,
  id: providedId,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  formatValue = String,
}: {
  label: string;
  id?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  formatValue?: (value: number) => string;
}) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <div className="grid gap-3">
      <div className="flex justify-between gap-3 text-sm">
        <label htmlFor={id} className="font-semibold">
          {label}
        </label>
        <output htmlFor={id}>{formatValue(value)}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        aria-valuetext={formatValue(value)}
        className="h-6 w-full accent-primary disabled:opacity-50"
      />
    </div>
  );
}
