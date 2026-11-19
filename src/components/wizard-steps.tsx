import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

/** Keep the selected step visible inside a narrow, horizontally scrolling track. */
function useCurrentStepVisibility(current: string | number) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = ref.current;
    const step = nav?.querySelector<HTMLElement>('[aria-current="step"]');
    if (!nav || !step) return;
    const track = nav.getBoundingClientRect();
    const item = step.getBoundingClientRect();
    if (!track.width) return;
    if (item.left < track.left + 4) nav.scrollLeft += item.left - track.left - 4;
    else if (item.right > track.right - 4) nav.scrollLeft += item.right - track.right + 4;
  }, [current]);

  return ref;
}

export interface ProgressStep {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface WizardStepsProps {
  steps: ProgressStep[];
  currentId: string;
  onStepChange: (id: string) => void;
  label?: string;
  completedColor?: string;
}

/** Selectable arrow steps; completion is positional, not form validation. */
export function WizardSteps({
  steps,
  currentId,
  onStepChange,
  label = 'Form steps',
  completedColor = '#f47c28',
}: WizardStepsProps) {
  const navRef = useCurrentStepVisibility(currentId);
  const current = steps.findIndex((step) => step.id === currentId);

  return (
    <nav
      ref={navRef}
      aria-label={label}
      className="overflow-x-auto p-1"
      style={{ '--dg-step-complete': completedColor } as CSSProperties}
    >
      <ol className="dg-arrow-steps isolate flex min-w-max gap-0.5">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className="relative min-w-32 flex-1 rounded-[4px] focus-within:outline-2 focus-within:outline-ring focus-within:outline-offset-2"
            data-complete={index < current || undefined}
            data-current={step.id === currentId || undefined}
          >
            <button
              type="button"
              disabled={step.disabled}
              className="flex min-h-14 w-full items-center justify-center gap-2 bg-card px-6 py-3 text-muted-foreground transition-colors duration-200 aria-[current=step]:bg-accent aria-[current=step]:font-bold aria-[current=step]:text-accent-foreground enabled:hover:bg-muted focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-current={step.id === currentId ? 'step' : undefined}
              onClick={() => onStepChange(step.id)}
            >
              {step.icon && <span aria-hidden>{step.icon}</span>}
              <span>{step.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function InsetStepper({
  steps,
  currentStep,
  completedCount,
  onStepChange,
  label = 'Progress',
}: {
  steps: ProgressStep[];
  currentStep: number;
  completedCount: number;
  onStepChange: (index: number) => void;
  label?: string;
}) {
  const navRef = useCurrentStepVisibility(currentStep);
  const completed = Math.max(0, Math.min(steps.length, Math.floor(completedCount)));

  return (
    <nav ref={navRef} aria-label={label} className="overflow-x-auto px-1 py-2">
      <ol className="dg-inset-steps isolate flex min-w-max">
        {steps.map((step, index) => (
          <li
            key={step.id}
            data-complete={index < completed || undefined}
            className="relative min-w-18 flex-1 text-center"
            data-reached={index <= completed || undefined}
            data-current={index === currentStep || undefined}
          >
            <button
              type="button"
              disabled={step.disabled || index > completed}
              className="grid w-full justify-items-center gap-3 rounded-lg p-1 text-foreground disabled:cursor-not-allowed disabled:text-muted-foreground"
              aria-current={index === currentStep ? 'step' : undefined}
              onClick={() => onStepChange(index)}
            >
              <span className="text-sm">{step.label}</span>
              <span
                aria-hidden
                className={cn(
                  'dg-inset-marker grid size-10 place-items-center rounded-full border-4 border-muted bg-card text-sm font-bold text-foreground',
                  index < completed && 'border-primary text-primary',
                  index === currentStep &&
                    'dg-inset-current border-primary bg-primary text-primary-foreground',
                )}
              >
                {index < completed && index !== currentStep ? <Check size={18} /> : index + 1}
              </span>
              <span className="sr-only">
                {index < completed ? 'Completed' : index > completed ? 'Locked' : 'Available'}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
