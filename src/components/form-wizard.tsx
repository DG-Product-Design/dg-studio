import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { Stepper } from './navigation';
import { Button } from './ui/button';
import { ActionButton } from './action-button';
import { Banner } from './feedback';

export interface WizardStep {
  id: string;
  label: string;
  content: ReactNode;
  validate?: () => boolean;
  visible?: boolean;
}

export interface WizardProgress {
  stepId: string;
}

/** Persist only explicitly selected, non-sensitive draft data. Pass a stable storage key. */
export function useWizardDraft<T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => value is T,
): {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
  clear: () => void;
  storageError: string | null;
} {
  const [value, setValue] = useState(initial);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

  const validate = useRef(isValid);
  const initialValue = useRef(initial);
  const skipValue = useRef<T | undefined>(undefined);
  useEffect(() => {
    validate.current = isValid;
  }, [isValid]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : undefined;
      setValue(parsed && validate.current(parsed) ? parsed : initialValue.current);
      setStorageError(null);
    } catch {
      setStorageError('Draft storage is unavailable. You can continue without saving a draft.');
    }

    setLoadedKey(key);
  }, [key]);
  useEffect(() => {
    if (loadedKey !== key || value === skipValue.current) return;
    skipValue.current = undefined;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      setStorageError('Draft could not be saved on this device.');
    }
  }, [key, value, loadedKey]);

  function clear() {
    try {
      localStorage.removeItem(key);
    } catch {
      setStorageError('Draft could not be removed from this device.');
    }

    skipValue.current = initialValue.current;
    setValue(initialValue.current);
  }

  return { value, setValue, clear, storageError };
}

export function FormWizard({
  steps,
  onComplete,
  finishLabel = 'Finish',
  progress,
  onProgressChange,
}: {
  steps: WizardStep[];
  onComplete: () => void | Promise<void>;
  finishLabel?: string;
  progress?: WizardProgress;
  onProgressChange?: (progress: WizardProgress) => void;
}) {
  const visible = steps.filter((s) => s.visible !== false);
  const [internal, setInternal] = useState(visible[0]?.id ?? '');
  const currentId = progress?.stepId ?? internal;
  const current = Math.max(
    0,
    visible.findIndex((s) => s.id === currentId),
  );

  const active = visible[current];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const heading = useRef<HTMLHeadingElement>(null);
  const previous = useRef(active?.id);
  const mounted = useRef(true);
  const submitting = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (previous.current !== active?.id) {
      heading.current?.focus();
      previous.current = active?.id;
    }
  }, [active?.id]);

  function navigate(index: number) {
    const destination = visible[index];
    if (!destination) return;
    setInternal(destination.id);
    onProgressChange?.({ stepId: destination.id });
    setError('');
  }

  async function next() {
    if (submitting.current || !active) return;
    setError('');
    if (active.validate && !active.validate()) return;
    if (current < visible.length - 1) {
      navigate(current + 1);

      return;
    }

    submitting.current = true;
    setBusy(true);
    try {
      await onComplete();
    } catch (e) {
      if (mounted.current) setError(e instanceof Error ? e.message : 'Unable to save. Try again.');
    } finally {
      submitting.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  if (!active) return null;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void next();
      }}
      className="overflow-hidden rounded-xl border bg-card"
    >
      <div className="border-b p-5">
        <Stepper steps={visible} currentStep={current} onStepChange={busy ? undefined : navigate} />
      </div>
      <div className="space-y-6 p-6">
        <h2 ref={heading} tabIndex={-1} className="text-xl font-semibold">
          {active.label}
        </h2>
        <fieldset disabled={busy} className="min-w-0 space-y-5">
          {active.content}
        </fieldset>
        {error && (
          <Banner title="Changes weren’t saved" tone="danger">
            {error}
          </Banner>
        )}
      </div>
      <footer className="flex items-center justify-between border-t p-5">
        <Button
          type="button"
          variant="outline"
          disabled={current === 0 || busy}
          onClick={() => navigate(current - 1)}
        >
          Back
        </Button>
        <ActionButton type="submit" loading={busy} loadingLabel="Saving changes">
          {current === visible.length - 1 ? finishLabel : 'Continue'}
        </ActionButton>
      </footer>
    </form>
  );
}
