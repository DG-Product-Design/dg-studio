import { useState, type ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export interface DotMenuButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'children'
> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: 'click' | 'hover';
}

/** Dots merge visibly before growing into a cross; closing reverses the sequence. */
export function DotMenuButton({
  open,
  defaultOpen = false,
  onOpenChange,
  trigger = 'click',
  className,
  onClick,
  onPointerEnter,
  onPointerLeave,
  onKeyDown,
  disabled,
  ...props
}: DotMenuButtonProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const expanded = open ?? internal;

  function change(value: boolean) {
    if (!disabled) {
      setInternal(value);
      onOpenChange?.(value);
    }
  }

  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      disabled={disabled}
      className={cn('dg-dot-menu', className)}
      data-open={expanded}
      aria-label={props['aria-label'] ?? (expanded ? 'Close menu' : 'Open menu')}
      aria-expanded={expanded}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) change(!expanded);
      }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (!event.defaultPrevented && trigger === 'hover' && event.pointerType !== 'touch')
          change(true);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (!event.defaultPrevented && trigger === 'hover' && event.pointerType !== 'touch')
          change(false);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented && event.key === 'Escape') change(false);
      }}
    >
      {[0, 1, 2].map((i) => (
        <span key={i} aria-hidden className={`dg-menu-dot dg-menu-dot-${i}`}>
          <span />
        </span>
      ))}
    </button>
  );
}
