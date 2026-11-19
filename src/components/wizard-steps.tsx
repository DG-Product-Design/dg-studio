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
      className="dg-wizard-nav"
      style={{ '--dg-step-complete': completedColor } as CSSProperties}
    >
      <ol className="dg-arrow-steps">
        {steps.map((step, index) => (
          <li
            key={step.id}
            data-complete={index < current || undefined}
            data-current={step.id === currentId || undefined}
          >
            <button
              type="button"
              disabled={step.disabled}
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
    <nav ref={navRef} aria-label={label} className="dg-inset-nav">
      <ol className="dg-inset-steps">
        {steps.map((step, index) => (
          <li
            key={step.id}
            data-complete={index < completed || undefined}
            data-reached={index <= completed || undefined}
            data-current={index === currentStep || undefined}
          >
            <button
              type="button"
              disabled={step.disabled || index > completed}
              aria-current={index === currentStep ? 'step' : undefined}
              onClick={() => onStepChange(index)}
            >
              <span className="dg-inset-label">{step.label}</span>
              <span
                aria-hidden
                className={cn('dg-inset-marker', index === currentStep && 'dg-inset-current')}
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
