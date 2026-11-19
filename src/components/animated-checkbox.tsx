import { useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface AnimatedCheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'children'
> {
  label: ReactNode;
  indeterminate?: boolean;
}

/** Native checkbox semantics with an SVG mark, independent of icon fonts. */
export function AnimatedCheckbox({
  label,
  indeterminate = false,
  id: providedId,
  className,
  ...props
}: AnimatedCheckboxProps) {
  const generated = useId();
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label htmlFor={providedId ?? generated} className={cn('dg-animated-checkbox', className)}>
      <input
        {...props}
        ref={ref}
        id={providedId ?? generated}
        type="checkbox"
        aria-checked={indeterminate ? 'mixed' : props['aria-checked']}
      />
      <span aria-hidden className="dg-checkbox-box">
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path className="dg-checkbox-check" pathLength="1" d="m4 10 4 4 8-8" />
          <path className="dg-checkbox-mixed" d="M4 10h12" />
        </svg>
      </span>
      <span className="dg-checkbox-label">{label}</span>
    </label>
  );
}
