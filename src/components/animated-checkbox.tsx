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
    <label
      htmlFor={providedId ?? generated}
      className={cn(
        'dg-animated-checkbox relative flex cursor-pointer items-start gap-3 leading-normal [--dg-checkbox-accent:#f47c28] has-disabled:cursor-not-allowed has-disabled:opacity-50',
        className,
      )}
    >
      <input
        {...props}
        ref={ref}
        id={providedId ?? generated}
        type="checkbox"
        className="absolute top-0.5 left-0 size-5 opacity-0"
        aria-checked={indeterminate ? 'mixed' : props['aria-checked']}
      />
      <span
        aria-hidden
        className="dg-checkbox-box relative mt-0.5 size-5 basis-5 shrink-0 rounded-[4px] border-2 text-[#241d39] transition-colors duration-200"
      >
        <svg
          className="relative size-full"
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
      <span>{label}</span>
    </label>
  );
}
