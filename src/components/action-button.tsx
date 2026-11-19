import type { ComponentProps, ReactNode } from 'react';
import { Spinner } from './loaders';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

export type ActionButtonProps = Omit<ComponentProps<typeof Button>, 'asChild'> & {
  loading?: boolean;
  loadingLabel?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

/** Leaves the original content in layout so the button does not jump during submission. */
export function ActionButton({
  loading = false,
  loadingLabel = 'Working',
  leadingIcon,
  trailingIcon,
  children,
  disabled,
  className,
  type = 'button',
  ...props
}: ActionButtonProps) {
  return (
    <Button
      {...props}
      type={type}
      className={cn('relative', className)}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-label={loading ? loadingLabel : props['aria-label']}
    >
      <span
        className={cn('inline-flex items-center gap-2', loading && 'invisible')}
        aria-hidden={loading || undefined}
      >
        {leadingIcon}
        {children}
        {trailingIcon}
      </span>
      {loading && (
        <span aria-hidden className="absolute inset-0 grid place-items-center">
          <Spinner size={16} color="currentColor" />
        </span>
      )}
    </Button>
  );
}
