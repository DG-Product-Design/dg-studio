import { useId, type ReactElement, type ReactNode } from "react";
import {
  Tabs as TabsPrimitive,
  Tooltip as TooltipPrimitive,
  Popover as PopoverPrimitive,
} from "radix-ui";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./theme";
import { cn } from "../lib/utils";
export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}
export function Tabs({
  items,
  value,
  onValueChange,
  label = "Views",
}: {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
}) {
  return (
    <TabsPrimitive.Root value={value} onValueChange={onValueChange}>
      <TabsPrimitive.List
        aria-label={label}
        className="flex flex-wrap gap-1 border-b pb-2"
      >
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground disabled:opacity-40"
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content
          key={item.value}
          value={item.value}
          className="pt-5"
        >
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
export function Pagination({
  page,
  pageCount,
  onPageChange,
  label = "Pagination",
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  label?: string;
}) {
  const count = Math.max(1, Math.floor(pageCount));
  const current = Math.min(count, Math.max(1, page));
  const pages = [...new Set([1, current - 1, current, current + 1, count])]
    .filter((p) => p >= 1 && p <= count)
    .sort((a, b) => a - b);
  return (
    <nav
      aria-label={label}
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-sm text-muted-foreground">
        Page {current} of {count}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous page"
          disabled={current <= 1}
          onClick={() => onPageChange(current - 1)}
        >
          <ChevronLeft aria-hidden />
        </Button>
        {pages.map((p, i) => (
          <span key={p} className="flex items-center gap-1">
            {i > 0 && p - pages[i - 1] > 1 && (
              <span aria-hidden className="px-1">
                …
              </span>
            )}
            <Button
              variant={p === current ? "default" : "ghost"}
              size="icon"
              aria-label={`Page ${p}`}
              aria-current={p === current ? "page" : undefined}
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          </span>
        ))}
        <Button
          variant="outline"
          size="icon"
          aria-label="Next page"
          disabled={current >= count}
          onClick={() => onPageChange(current + 1)}
        >
          <ChevronRight aria-hidden />
        </Button>
      </div>
    </nav>
  );
}
export function Tooltip({
  children,
  content,
}: {
  children: ReactElement;
  content: string;
}) {
  const theme = useTheme();
  return (
    <TooltipPrimitive.Provider delayDuration={250}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            data-theme={theme}
            sideOffset={6}
            className="dg-theme z-[90] max-w-xs rounded-md border px-3 py-2 text-xs shadow-lg"
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-border" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
export function Popover({
  trigger,
  title,
  children,
}: {
  trigger: ReactElement;
  title: string;
  children: ReactNode;
}) {
  const theme = useTheme();
  const id = useId();
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-theme={theme}
          aria-labelledby={id}
          sideOffset={8}
          className="dg-theme z-[70] w-80 max-w-[calc(100vw-2rem)] rounded-xl border p-5 shadow-xl"
        >
          <h2 id={id} className="mb-3 pr-7 font-semibold">
            {title}
          </h2>
          {children}
          <PopoverPrimitive.Close asChild>
            <Button
              aria-label="Close popover"
              variant="ghost"
              size="icon-sm"
              className="absolute top-3 right-3"
            >
              <X aria-hidden />
            </Button>
          </PopoverPrimitive.Close>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
export function Stepper({
  steps,
  currentStep,
  onStepChange,
}: {
  steps: { id: string; label: string }[];
  currentStep: number;
  onStepChange?: (step: number) => void;
}) {
  return (
    <ol aria-label="Progress" className="flex flex-wrap gap-x-6 gap-y-3">
      {steps.map((step, i) => (
        <li
          key={step.id}
          aria-current={i === currentStep ? "step" : undefined}
          className={cn(
            "flex items-center gap-2 text-sm",
            i === currentStep
              ? "font-semibold text-foreground"
              : "text-muted-foreground",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "grid size-7 place-items-center rounded-full border",
              i <= currentStep &&
                "border-primary bg-primary text-primary-foreground",
            )}
          >
            {i < currentStep ? <Check className="size-4" /> : i + 1}
          </span>
          {onStepChange && i < currentStep ? (
            <button
              type="button"
              className="underline underline-offset-4"
              onClick={() => onStepChange(i)}
            >
              {step.label}
            </button>
          ) : (
            <span>{step.label}</span>
          )}
        </li>
      ))}
    </ol>
  );
}
