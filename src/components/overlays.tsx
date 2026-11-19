import type { ReactNode, RefObject } from 'react';
import { Dialog as Primitive } from 'radix-ui';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './theme';
import { cn } from '../lib/utils';
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './ui/dialog';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children?: ReactNode;
  footer?: ReactNode;
  trigger?: ReactNode;
  className?: string;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

/** Uses shadcn's Radix foundation; tokens travel into the portal through context. */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  trigger,
  className,
  returnFocusRef,
  side = false,
}: ModalProps & { side?: boolean }) {
  const theme = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm" />
        <Primitive.Content
          data-theme={theme}
          onCloseAutoFocus={(event) => {
            if (returnFocusRef?.current) {
              event.preventDefault();
              returnFocusRef.current.focus();
            }
          }}
          className={cn(
            'bg-background text-foreground font-sans fixed z-50 flex flex-col border border-border bg-card shadow-2xl',
            side
              ? 'inset-y-0 right-0 w-full max-w-md data-[state=open]:animate-[dg-slide_240ms_cubic-bezier(0.16,1,0.3,1)]'
              : 'data-[state=open]:animate-[dg-appear_180ms_ease-out] top-1/2 left-1/2 max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl',
            className,
          )}
        >
          <header className="border-b p-6 pr-16">
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto p-6">{children}</div>
          {footer && (
            <footer className="flex flex-wrap justify-end gap-2 border-t p-5">{footer}</footer>
          )}
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close dialog"
              className="absolute top-4 right-4"
            >
              <X aria-hidden />
            </Button>
          </DialogClose>
        </Primitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

export function DetailsPanel(props: ModalProps) {
  return <Modal {...props} side />;
}

export function ConfirmDialog({
  onConfirm,
  confirmLabel = 'Confirm',
  ...props
}: Omit<ModalProps, 'footer'> & {
  onConfirm: () => void;
  confirmLabel?: string;
}) {
  return (
    <Modal
      {...props}
      footer={
        <>
          <Button variant="outline" onClick={() => props.onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              props.onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
