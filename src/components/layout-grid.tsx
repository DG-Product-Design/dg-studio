import { useState, type CSSProperties, type HTMLAttributes } from 'react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

type Span = number | { mobile: number; desktop: number };

const pair = (value: Span) =>
  typeof value === 'number' ? [value, value] : [value.mobile, value.desktop];

export function MarketplaceGrid({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6', className)} />;
}

export function Row({
  columns = { mobile: 12, desktop: 16 },
  gap = 16,
  debug = false,
  style,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  columns?: Span;
  gap?: number;
  debug?: boolean;
}) {
  const [mobile, desktop] = pair(columns);

  return (
    <div
      {...props}
      data-debug={debug || undefined}
      className={cn(
        'flex flex-wrap gap-(--dg-grid-gap) [--dg-columns:var(--dg-columns-mobile)] lg:[--dg-columns:var(--dg-columns-desktop)] data-[debug]:outline data-[debug]:outline-dashed data-[debug]:outline-primary data-[debug]:bg-primary/8',
        className,
      )}
      style={
        {
          '--dg-columns-mobile': mobile,
          '--dg-columns-desktop': desktop,
          '--dg-grid-gap': `${gap}px`,
          ...style,
        } as CSSProperties
      }
    />
  );
}

export function Column({
  span = { mobile: 12, desktop: 8 },
  offset = 0,
  fill = false,
  debug = false,
  className,
  style,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  span?: Span;
  offset?: Span;
  fill?: boolean;
  debug?: boolean;
}) {
  const [mobile, desktop] = pair(span);
  const [offMobile, offDesktop] = pair(offset);

  return (
    <div
      {...props}
      className={cn(
        'dg-column min-w-0 [--dg-span:var(--dg-span-mobile)] [--dg-offset:var(--dg-offset-mobile)] lg:[--dg-span:var(--dg-span-desktop)] lg:[--dg-offset:var(--dg-offset-desktop)] data-[fill]:flex-1 data-[debug]:outline data-[debug]:outline-dashed data-[debug]:outline-primary data-[debug]:bg-primary/8',
        className,
      )}
      data-fill={fill || undefined}
      data-debug={debug || undefined}
      style={
        {
          '--dg-span-mobile': mobile,
          '--dg-span-desktop': desktop,
          '--dg-offset-mobile': offMobile,
          '--dg-offset-desktop': offDesktop,
          ...style,
        } as CSSProperties
      }
    >
      {debug && (
        <span className="mb-2 block text-xs">
          {mobile} / {desktop} columns
        </span>
      )}
      {children}
    </div>
  );
}

export function GridHelper({
  children,
  defaultVisible = false,
}: {
  children: React.ReactNode;
  defaultVisible?: boolean;
}) {
  const [visible, setVisible] = useState(defaultVisible);

  return (
    <div className="space-y-4">
      <Button
        type="button"
        size="sm"
        variant="outline"
        aria-pressed={visible}
        onClick={() => setVisible(!visible)}
      >
        Toggle grid overlay
      </Button>
      <div className="relative">
        {children}
        {visible && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 grid grid-cols-12 gap-4 lg:grid-cols-16"
          >
            {Array.from({ length: 16 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  'border-x border-primary/40 bg-primary/10 text-center text-xs',
                  i >= 12 && 'hidden lg:block',
                )}
              >
                {i + 1}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
