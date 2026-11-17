import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Slider } from "radix-ui";
import { Check } from "lucide-react";
import { TextField, type SelectOption } from "./fields";
import { cn } from "../lib/utils";
export interface SearchSelectProps {
  label: string;
  value: SelectOption | SelectOption[] | null;
  onValueChange: (value: SelectOption | SelectOption[] | null) => void;
  options?: SelectOption[];
  loadOptions?: (query: string, signal: AbortSignal) => Promise<SelectOption[]>;
  multiple?: boolean;
  disabled?: boolean;
  renderOption?: (option: SelectOption) => ReactNode;
  onCreate?: (query: string) => SelectOption | Promise<SelectOption>;
  placeholder?: string;
}
export function SearchSelect({
  label,
  value,
  onValueChange,
  options = [],
  loadOptions,
  multiple = false,
  disabled = false,
  renderOption,
  onCreate,
  placeholder = "Search options…",
}: SearchSelectProps) {
  const id = useId(),
    root = useRef<HTMLDivElement>(null),
    input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(""),
    [open, setOpen] = useState(false),
    [active, setActive] = useState(-1),
    [remote, setRemote] = useState<SelectOption[]>([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const request = useRef(0);
  const mounted = useRef(true);
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const filtered = loadOptions
    ? remote
    : options.filter((o) =>
        `${o.label} ${o.description ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      );
  const enabled = filtered
    .map((o, i) => (o.disabled ? -1 : i))
    .filter((i) => i >= 0);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (!open || !loadOptions) return;
    const controller = new AbortController();
    const revision = ++request.current;
    setBusy(true);
    setRemote([]);
    setError("");
    const timer = setTimeout(() => {
      void loadOptions(query, controller.signal)
        .then((data) => {
          if (!controller.signal.aborted && revision === request.current) {
            setRemote(data);
            setActive(-1);
          }
        })
        .catch((e) => {
          if (!controller.signal.aborted)
            setError(
              e instanceof Error ? e.message : "Unable to load options.",
            );
        })
        .finally(() => {
          if (!controller.signal.aborted) setBusy(false);
        });
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, loadOptions, open]);
  function choose(option: SelectOption) {
    if (option.disabled) return;
    onValueChange(
      multiple
        ? selected.some((s) => s.value === option.value)
          ? selected.filter((s) => s.value !== option.value)
          : [...selected, option]
        : option,
    );
    setQuery("");
    setActive(-1);
    if (!multiple) setOpen(false);
    input.current?.focus();
  }
  async function create() {
    if (!onCreate || !query.trim() || busy) return;
    setBusy(true);
    setRemote([]);
    setError("");
    try {
      const option = await onCreate(query.trim());
      if (mounted.current) choose(option);
    } catch (e) {
      if (mounted.current)
        setError(e instanceof Error ? e.message : "Unable to create option.");
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  return (
    <div
      ref={root}
      className="relative space-y-2"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOpen(false);
          setActive(-1);
        }
      }}
    >
      <TextField
        ref={input}
        label={label}
        value={query}
        disabled={disabled}
        placeholder={
          selected.length
            ? selected.map((o) => o.label).join(", ")
            : placeholder
        }
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={
          open && active >= 0 && filtered[active]
            ? `${id}-${active}`
            : undefined
        }
        error={error || undefined}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(-1);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            setActive(-1);
          } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
            if ((e.key === "Home" || e.key === "End") && !open) return;
            e.preventDefault();
            setOpen(true);
            const position = enabled.indexOf(active);
            const next =
              e.key === "Home"
                ? 0
                : e.key === "End"
                  ? enabled.length - 1
                  : e.key === "ArrowDown"
                    ? (position + 1) % enabled.length
                    : position <= 0
                      ? enabled.length - 1
                      : position - 1;
            setActive(enabled[next] ?? -1);
          } else if (
            e.key === "Enter" &&
            open &&
            active >= 0 &&
            filtered[active]
          ) {
            e.preventDefault();
            choose(filtered[active]);
          }
        }}
      />
      {selected.length > 0 && (
        <ul aria-label={`Selected ${label}`} className="flex flex-wrap gap-2">
          {selected.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                disabled={disabled}
                aria-label={`Remove ${o.label}`}
                className="rounded-full border bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                onClick={() =>
                  onValueChange(
                    multiple
                      ? selected.filter((s) => s.value !== o.value)
                      : null,
                  )
                }
              >
                {o.label} ×
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && (
        <div className="absolute inset-x-0 top-full z-30 mt-1 max-h-72 overflow-auto rounded-lg border bg-card p-1 shadow-xl">
          <ul
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            aria-multiselectable={multiple || undefined}
            aria-busy={busy}
          >
            {filtered.map((o, i) => (
              <li
                key={o.value}
                id={`${id}-${i}`}
                role="option"
                aria-selected={selected.some((s) => s.value === o.value)}
                aria-disabled={o.disabled || undefined}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(o)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded px-3 py-2 text-sm",
                  i === active && "bg-accent",
                  o.disabled && "cursor-not-allowed opacity-40",
                )}
              >
                {renderOption ? (
                  renderOption(o)
                ) : (
                  <span>
                    {o.label}
                    {o.description && (
                      <small className="block text-muted-foreground">
                        {o.description}
                      </small>
                    )}
                  </span>
                )}
                {selected.some((s) => s.value === o.value) && (
                  <Check aria-hidden className="size-4" />
                )}
              </li>
            ))}
          </ul>
          {busy && (
            <p role="status" className="p-3 text-sm">
              Loading options…
            </p>
          )}
          {!busy && !filtered.length && (
            <p role="status" className="p-3 text-sm">
              No matching options
            </p>
          )}
          {onCreate &&
            query.trim() &&
            !filtered.some(
              (o) => o.label.toLowerCase() === query.trim().toLowerCase(),
            ) && (
              <button
                type="button"
                disabled={busy}
                className="w-full rounded p-3 text-left text-sm text-primary"
                onClick={() => void create()}
              >
                Create “{query.trim()}”
              </button>
            )}
        </div>
      )}
    </div>
  );
}
export function RangeSlider({
  label,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  formatValue = String,
}: {
  label: string;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  formatValue?: (value: number) => string;
}) {
  const id = useId();
  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-4">
        <span id={id} className="text-sm font-medium">
          {label}
        </span>
        <output className="text-sm tabular-nums">
          {formatValue(value[0])} – {formatValue(value[1])}
        </output>
      </div>
      <Slider.Root
        aria-labelledby={id}
        value={value}
        onValueChange={(v) => onValueChange([v[0], v[1]])}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="relative flex h-7 touch-none items-center data-[disabled]:opacity-50"
      >
        <Slider.Track className="relative h-2 grow rounded-full bg-muted">
          <Slider.Range className="absolute h-full rounded-full bg-primary" />
        </Slider.Track>
        {["Minimum", "Maximum"].map((name, i) => (
          <Slider.Thumb
            key={name}
            aria-label={`${label} ${name}`}
            aria-valuetext={formatValue(value[i])}
            className="block size-5 rounded-full border-2 border-primary bg-card shadow"
          />
        ))}
      </Slider.Root>
    </div>
  );
}
