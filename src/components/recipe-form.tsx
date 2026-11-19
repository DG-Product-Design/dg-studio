import { useId, useRef, useState, type ReactNode } from 'react';
import {
  TextField,
  SelectField,
  MultiSelectField,
  CheckboxField,
  RadioCards,
  type SelectOption,
} from './fields';
import { PasswordField, TextareaField, defaultPasswordRules } from './specialized-fields';
import { ActionButton } from './action-button';
import { Button } from './ui/button';
import { Banner } from './feedback';
import { FormHeader } from './foundation-primitives';

export type FormValue = string | number | boolean | string[];
export type FormValues = Record<string, FormValue>;

export interface RecipeField {
  name: string;
  label: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'time'
    | 'tel'
    | 'textarea'
    | 'select'
    | 'multi'
    | 'checkbox'
    | 'radio';
  required?: boolean;
  hint?: string;
  min?: number;
  max?: number;
  options?: SelectOption[];
  autoComplete?: string;
  when?: (values: FormValues) => boolean;
  validate?: (value: FormValue, values: FormValues) => string | undefined;
}

export interface FormProps {
  title: string;
  description?: string;
  fields: RecipeField[];
  defaultValues?: FormValues;
  submitLabel?: string;
  onSubmit: (values: FormValues) => void | Promise<void>;
  onCancel?: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  validate?: (values: FormValues) => Record<string, string>;
}

export function Form({
  title,
  description,
  fields,
  defaultValues = {},
  submitLabel = 'Save changes',
  onSubmit,
  onCancel,
  children,
  footer,
  validate,
}: FormProps) {
  const [values, setValues] = useState<FormValues>(() =>
    Object.fromEntries(
      fields.map((f) => [
        f.name,
        defaultValues[f.name] ?? (f.type === 'multi' ? [] : f.type === 'checkbox' ? false : ''),
      ]),
    ),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitting = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const id = useId();

  const visible = fields.filter((f) => !f.when || f.when(values));

  function change(name: string, value: FormValue) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[name];

      return next;
    });
    setSubmitted(false);
  }

  async function submit() {
    if (submitting.current) return;
    const next: Record<string, string> = {};
    for (const f of visible) {
      const value = values[f.name];
      if (
        f.required &&
        (value === undefined ||
          value === false ||
          (typeof value === 'string' && !value.trim()) ||
          (Array.isArray(value) && !value.length))
      )
        next[f.name] = `${f.label} is required.`;
      else if (value !== '' && value !== undefined) {
        if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)))
          next[f.name] = 'Enter a valid email address.';
        if (
          f.type === 'number' &&
          (!Number.isFinite(Number(value)) ||
            (f.min !== undefined && Number(value) < f.min) ||
            (f.max !== undefined && Number(value) > f.max))
        )
          next[f.name] =
            `Enter a number${f.min !== undefined ? ` of at least ${f.min}` : ''}${f.max !== undefined ? ` and at most ${f.max}` : ''}.`;
        const custom = f.validate?.(value, values);
        if (custom) next[f.name] = custom;
      }
    }

    Object.assign(next, validate?.(values));
    setErrors(next);
    setFailure('');
    setSubmitted(false);
    if (Object.keys(next).length) {
      requestAnimationFrame(() =>
        form.current?.querySelector<HTMLElement>(`[id="${id}-${Object.keys(next)[0]}"]`)?.focus(),
      );

      return;
    }

    submitting.current = true;
    setBusy(true);
    try {
      const payload = Object.fromEntries(
        visible.map((f) => [f.name, f.type === 'number' ? Number(values[f.name]) : values[f.name]]),
      );

      await onSubmit(payload);
      setSubmitted(true);
    } catch (e) {
      setFailure(e instanceof Error ? e.message : 'Unable to save. Try again.');
    } finally {
      setBusy(false);
      submitting.current = false;
    }
  }

  return (
    <form
      ref={form}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      className="space-y-6 rounded-xl border bg-card p-5 sm:p-6"
    >
      <FormHeader title={title} description={description} />
      <fieldset disabled={busy} className="min-w-0 space-y-5">
        {visible.map((f) => {
          const value = values[f.name];
          const error = errors[f.name];
          const fieldId = `${id}-${f.name}`;

          const options = f.options ?? [];

          return (
            <div key={f.name}>
              {f.type === 'select' ? (
                <SelectField
                  id={fieldId}
                  name={f.name}
                  label={f.label}
                  value={String(value ?? '')}
                  onValueChange={(v) => change(f.name, v)}
                  options={options}
                  hint={f.hint}
                  error={error}
                  disabled={busy}
                />
              ) : f.type === 'multi' ? (
                <MultiSelectField
                  id={fieldId}
                  name={f.name}
                  label={f.label}
                  value={Array.isArray(value) ? value : []}
                  onValueChange={(v) => change(f.name, v)}
                  options={options}
                  hint={f.hint}
                  error={error}
                  disabled={busy}
                />
              ) : f.type === 'checkbox' ? (
                <>
                  <CheckboxField
                    id={fieldId}
                    name={f.name}
                    label={f.label}
                    checked={!!value}
                    onChange={(e) => change(f.name, e.target.checked)}
                    description={f.hint}
                  />
                  {error && (
                    <p role="alert" className="mt-2 text-sm text-destructive">
                      {error}
                    </p>
                  )}
                </>
              ) : f.type === 'radio' ? (
                <>
                  <RadioCards
                    label={f.label}
                    value={String(value ?? '')}
                    options={options}
                    onValueChange={(v) => change(f.name, v)}
                  />
                  {error && (
                    <p role="alert" className="mt-2 text-sm text-destructive">
                      {error}
                    </p>
                  )}
                </>
              ) : f.type === 'textarea' ? (
                <TextareaField
                  id={fieldId}
                  name={f.name}
                  label={f.label}
                  value={String(value ?? '')}
                  onChange={(v) => change(f.name, v)}
                  error={error}
                  hint={f.hint}
                />
              ) : f.type === 'password' ? (
                <PasswordField
                  id={fieldId}
                  name={f.name}
                  label={f.label}
                  value={String(value ?? '')}
                  onChange={(e) => change(f.name, e.target.value)}
                  autoComplete={f.autoComplete}
                  hint={f.hint}
                  error={error}
                  showRequirements={f.autoComplete === 'new-password' && f.name !== 'confirmation'}
                />
              ) : (
                <TextField
                  id={fieldId}
                  name={f.name}
                  label={f.label}
                  type={f.type ?? 'text'}
                  value={String(value ?? '')}
                  onChange={(e) => change(f.name, e.target.value)}
                  required={f.required}
                  autoComplete={f.autoComplete}
                  min={f.min}
                  max={f.max}
                  hint={f.hint}
                  error={error}
                />
              )}
            </div>
          );
        })}
        {children}
      </fieldset>
      {Object.keys(errors).length > 0 && (
        <Banner title="Check the form" tone="danger">
          <ul className="list-disc pl-5">
            {Object.entries(errors).map(([key, message]) => (
              <li key={key}>{message}</li>
            ))}
          </ul>
        </Banner>
      )}
      {failure && (
        <Banner title="Changes weren’t saved" tone="danger">
          {failure}
        </Banner>
      )}
      {submitted && (
        <p role="status" className="text-sm text-success">
          Changes saved.
        </p>
      )}
      <footer className="flex flex-wrap justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>
            Cancel
          </Button>
        )}
        <ActionButton type="submit" loading={busy} loadingLabel="Saving changes">
          {submitLabel}
        </ActionButton>
      </footer>
      {footer}
    </form>
  );
}

export const passwordValidation = (value: FormValue) =>
  defaultPasswordRules.every((rule) => rule.test(String(value)))
    ? undefined
    : 'Complete the password requirements.';
