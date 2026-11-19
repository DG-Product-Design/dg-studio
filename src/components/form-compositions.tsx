import { useState, type ReactNode } from 'react';
import { Form, type FormValues, type RecipeField } from './recipe-form';
import { Address, emptyAddress, CreditCardInput, type AddressValue } from './specialized-fields';
import { Button } from './ui/button';
import { TextField, SelectField, CheckboxField } from './fields';

export function FormUpdateAddress({
  defaultValue = emptyAddress,
  onSubmit,
  onCancel,
}: {
  defaultValue?: AddressValue;
  onSubmit: (value: AddressValue) => void | Promise<void>;
  onCancel?: () => void;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <Form
      title="Update address"
      fields={[]}
      onCancel={onCancel}
      validate={(): Record<string, string> =>
        Object.values({ ...value, street2: 'optional' }).some((v) => !v.trim())
          ? { address: 'Complete the required address fields.' }
          : {}
      }
      onSubmit={() => onSubmit(value)}
    >
      <Address value={value} onValueChange={setValue} />
    </Form>
  );
}

export function CardInformation({
  secureFields,
  complete,
  onCreatePaymentMethod,
  onSubmit,
  onCancel,
  verification,
}: {
  secureFields: ReactNode;
  complete: boolean;
  onCreatePaymentMethod: () => Promise<string>;
  onSubmit: (value: {
    paymentMethodId: string;
    nickname: string;
    makeDefault: boolean;
  }) => void | Promise<void>;
  onCancel?: () => void;
  verification?: ReactNode;
}) {
  return (
    <Form
      title="Add payment method"
      submitLabel="Add card"
      onCancel={onCancel}
      fields={[
        { name: 'nickname', label: 'Card nickname' },
        {
          name: 'makeDefault',
          label: 'Make this my default payment method',
          type: 'checkbox',
        },
      ]}
      onSubmit={async (values) => {
        if (!complete) throw new Error('Complete the secure payment fields.');
        const paymentMethodId = await onCreatePaymentMethod();
        await onSubmit({
          paymentMethodId,
          nickname: String(values.nickname ?? ''),
          makeDefault: !!values.makeDefault,
        });
      }}
    >
      <CreditCardInput complete={complete} verification={verification}>
        {secureFields}
      </CreditCardInput>
    </Form>
  );
}

export const FormAddCardInformation = CardInformation;

export interface AdditionalQuestion {
  id: string;
  label: string;
  type: 'text' | 'date' | 'select';
  required?: boolean;
  options?: { value: string; label: string }[];
  sharedKey?: string;
}

export interface QuestionGroup {
  id: string;
  title: string;
  questions: AdditionalQuestion[];
}

export function FormAdditionalInformation({
  groups,
  onSubmit,
}: {
  groups: QuestionGroup[];
  onSubmit: (value: FormValues) => void | Promise<void>;
}) {
  const [values, setValues] = useState<FormValues>({});
  const [sync, setSync] = useState(false);

  function change(group: QuestionGroup, question: AdditionalQuestion, value: string) {
    setValues((current) => {
      const next = { ...current, [`${group.id}.${question.id}`]: value };
      if (sync && question.sharedKey)
        for (const other of groups)
          for (const q of other.questions)
            if (q.sharedKey === question.sharedKey) next[`${other.id}.${q.id}`] = value;

      return next;
    });
  }

  return (
    <Form
      title="Additional information"
      submitLabel="Save answers"
      fields={[]}
      validate={(): Record<string, string> =>
        Object.fromEntries(
          groups.flatMap((g) =>
            g.questions
              .filter((q) => q.required && !String(values[`${g.id}.${q.id}`] ?? '').trim())
              .map((q) => [`${g.id}.${q.id}`, `${g.title}: ${q.label} is required.`]),
          ),
        )
      }
      onSubmit={() => onSubmit(values)}
    >
      <CheckboxField
        label="Apply matching answers to all products"
        checked={sync}
        onChange={(e) => {
          setSync(e.target.checked);
          if (e.target.checked)
            setValues((current) => {
              const next = { ...current };
              const shared = new Map<string, FormValues[string]>();
              for (const g of groups)
                for (const q of g.questions)
                  if (q.sharedKey && current[`${g.id}.${q.id}`])
                    shared.set(q.sharedKey, current[`${g.id}.${q.id}`]);
              for (const g of groups)
                for (const q of g.questions)
                  if (q.sharedKey && shared.has(q.sharedKey))
                    next[`${g.id}.${q.id}`] = shared.get(q.sharedKey)!;

              return next;
            });
        }}
      />
      {groups.map((g) => (
        <fieldset key={g.id} className="space-y-4 rounded-lg border p-4">
          <legend className="px-2 font-semibold">{g.title}</legend>
          {g.questions.map((q) =>
            q.type === 'select' ? (
              <SelectField
                key={q.id}
                label={q.label}
                value={String(values[`${g.id}.${q.id}`] ?? '')}
                onValueChange={(v) => change(g, q, v)}
                options={q.options ?? []}
              />
            ) : (
              <TextField
                key={q.id}
                label={q.label}
                type={q.type === 'date' ? 'date' : 'text'}
                required={q.required}
                value={String(values[`${g.id}.${q.id}`] ?? '')}
                onChange={(e) => change(g, q, e.target.value)}
              />
            ),
          )}
        </fieldset>
      ))}
    </Form>
  );
}

export function FormCheckoutUserInfo({
  onSubmit,
  defaultValues = {},
}: {
  onSubmit: (values: {
    firstName: string;
    lastName: string;
    email: string;
    address: AddressValue;
  }) => void | Promise<void>;
  defaultValues?: FormValues;
}) {
  const [address, setAddress] = useState(emptyAddress);
  const fields: RecipeField[] = [
    { name: 'firstName', label: 'First name', required: true },
    { name: 'lastName', label: 'Last name', required: true },
    { name: 'email', label: 'Email address', type: 'email', required: true },
  ];

  return (
    <Form
      title="Checkout information"
      fields={fields}
      defaultValues={defaultValues}
      submitLabel="Continue"
      validate={(): Record<string, string> =>
        !address.street.trim() || !address.city.trim() || !address.postalCode.trim()
          ? { address: 'Complete the shipping address.' }
          : {}
      }
      onSubmit={(values) =>
        onSubmit({
          firstName: String(values.firstName),
          lastName: String(values.lastName),
          email: String(values.email),
          address,
        })
      }
    >
      <Address value={address} onValueChange={setAddress} />
    </Form>
  );
}

export function ReviewConfirmation({
  title,
  items,
  onConfirm,
  onBack,
  busy = false,
}: {
  title: string;
  items: { label: string; value: ReactNode }[];
  onConfirm: () => void;
  onBack: () => void;
  busy?: boolean;
}) {
  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <dl className="divide-y">
        {items.map((item) => (
          <div key={item.label} className="grid grid-cols-2 gap-4 py-3 text-sm">
            <dt className="text-muted-foreground">{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex justify-end gap-3">
        <Button variant="outline" disabled={busy} onClick={onBack}>
          Back
        </Button>
        <Button disabled={busy} onClick={onConfirm}>
          {busy ? 'Confirming…' : 'Confirm'}
        </Button>
      </div>
    </section>
  );
}
