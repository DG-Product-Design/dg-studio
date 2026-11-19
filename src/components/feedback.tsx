import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Toast as ToastPrimitive } from 'radix-ui';
import { Check, CheckCircle2, Copy, Info, TriangleAlert, X, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './theme';
import { cn } from '../lib/utils';

export type FeedbackTone = 'info' | 'success' | 'warning' | 'danger';
const tones = {
  info: { Icon: Info, color: 'text-primary' },
  success: { Icon: CheckCircle2, color: 'text-success' },
  warning: { Icon: TriangleAlert, color: 'text-warning' },
  danger: { Icon: XCircle, color: 'text-destructive' },
};

export function Banner({
  title,
  children,
  tone = 'info',
  action,
  onDismiss,
  className,
}: {
  title: string;
  children?: ReactNode;
  tone?: FeedbackTone;
  action?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  const { Icon, color } = tones[tone];

  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('flex items-start gap-3 rounded-lg border bg-card p-4', className)}
    >
      <Icon aria-hidden className={cn('mt-0.5 size-5 shrink-0', color)} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {children && (
          <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{children}</div>
        )}
        {action && <div className="mt-3">{action}</div>}
      </div>
      {onDismiss && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onDismiss}
          aria-label={`Dismiss ${title}`}
        >
          <X aria-hidden />
        </Button>
      )}
    </div>
  );
}

export function ToastProvider({
  children,
  duration = 6000,
}: {
  children: ReactNode;
  duration?: number;
}) {
  const theme = useTheme();

  return (
    <ToastPrimitive.Provider duration={duration} swipeDirection="right">
      {children}
      <ToastPrimitive.Viewport
        data-theme={theme}
        className="fixed right-4 bottom-4 z-[80] flex w-96 max-w-[calc(100vw-2rem)] flex-col gap-3 outline-none"
      />
    </ToastPrimitive.Provider>
  );
}

export function Toast({
  title,
  description,
  open,
  onOpenChange,
  action,
}: {
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action?: { label: string; altText: string; onClick: () => void };
}) {
  const theme = useTheme();

  return (
    <ToastPrimitive.Root
      data-theme={theme}
      open={open}
      onOpenChange={onOpenChange}
      className="bg-background text-foreground font-sans relative rounded-xl border p-5 pr-12 shadow-xl data-[state=open]:animate-[dg-appear_180ms_ease-out]"
    >
      <ToastPrimitive.Title className="text-sm font-semibold">{title}</ToastPrimitive.Title>
      {description && (
        <ToastPrimitive.Description className="mt-1 text-sm text-muted-foreground">
          {description}
        </ToastPrimitive.Description>
      )}
      {action && (
        <ToastPrimitive.Action altText={action.altText} asChild>
          <Button className="mt-3" size="sm" variant="secondary" onClick={action.onClick}>
            {action.label}
          </Button>
        </ToastPrimitive.Action>
      )}
      <ToastPrimitive.Close asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Dismiss notification"
          className="absolute top-3 right-3"
        >
          <X aria-hidden />
        </Button>
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

export function ClickToCopy({
  value,
  label = 'Copy value',
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    setStatus('copying');
    try {
      await navigator.clipboard.writeText(value);
      if (!mounted.current) return;
      setStatus('copied');
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus('idle'), 2500);
    } catch {
      if (mounted.current) setStatus('error');
    }
  }

  return (
    <div className={cn('min-w-0', className)}>
      <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-xs">{value}</code>
        <Button
          size="sm"
          variant="outline"
          disabled={status === 'copying'}
          aria-label={label}
          onClick={() => void copy()}
        >
          {status === 'copied' ? <Check aria-hidden /> : <Copy aria-hidden />}
          {status === 'copied' ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <p role="status" className="mt-1 min-h-4 text-xs text-muted-foreground">
        {status === 'copied'
          ? 'Copied to clipboard.'
          : status === 'error'
            ? 'Clipboard unavailable. Select and copy the value above.'
            : ''}
      </p>
    </div>
  );
}

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn('rounded-md bg-muted motion-safe:animate-pulse', className)}
    />
  );
}
