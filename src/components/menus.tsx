import { useEffect, useRef, useState, type ReactNode } from 'react';
import { DropdownMenu } from 'radix-ui';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { DetailsPanel, type ModalProps } from './overlays';
import { useTheme } from './theme';
import { cn } from '../lib/utils';

export interface MenuItem {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => void;
  children?: MenuItem[];
}

const menuClass =
  'dg-theme z-[90] min-w-48 max-w-[calc(100vw-2rem)] rounded-lg border p-1 shadow-xl';

const itemClass =
  'flex cursor-default items-center justify-between gap-5 rounded px-3 py-2 text-sm outline-none data-[highlighted]:bg-accent data-[disabled]:opacity-40';

function MenuItems({ items }: { items: MenuItem[] }) {
  const theme = useTheme();

  return (
    <>
      {items.map((item) =>
        item.children?.length ? (
          <DropdownMenu.Sub key={item.id}>
            <DropdownMenu.SubTrigger disabled={item.disabled} className={itemClass}>
              {item.label}
              <ChevronRight aria-hidden className="size-4" />
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent data-theme={theme} className={menuClass} sideOffset={5}>
                <MenuItems items={item.children} />
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
        ) : (
          <DropdownMenu.Item
            key={item.id}
            disabled={item.disabled}
            onSelect={item.onSelect}
            className={cn(itemClass, item.destructive && 'text-destructive')}
          >
            <span>
              {item.label}
              {item.description && (
                <span className="block text-xs text-muted-foreground">{item.description}</span>
              )}
            </span>
          </DropdownMenu.Item>
        ),
      )}
    </>
  );
}

export function NestedMenu({
  items,
  trigger = (
    <Button type="button" variant="outline" aria-label="Open actions">
      <MoreHorizontal aria-hidden />
    </Button>
  ),
}: {
  items: MenuItem[];
  trigger?: ReactNode;
}) {
  const theme = useTheme();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content data-theme={theme} className={menuClass} sideOffset={6}>
          <MenuItems items={items} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function SimpleMenu(props: Parameters<typeof NestedMenu>[0]) {
  return <NestedMenu {...props} />;
}

export interface DrawerSection {
  id: string;
  label: string;
  content?: ReactNode;
  children?: DrawerSection[];
}

function DrawerNavigation({ sections }: { sections: DrawerSection[] }) {
  const [path, setPath] = useState<string[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const previous = useRef(path);
  let items = sections;
  let active: DrawerSection | undefined;
  const valid: string[] = [];
  for (const id of path) {
    const found = items.find((item) => item.id === id);
    if (!found) break;
    active = found;
    valid.push(id);
    items = found.children ?? [];
  }

  useEffect(() => {
    if (previous.current !== path) heading.current?.focus();
    previous.current = path;
  }, [path]);

  return (
    <div className="space-y-5">
      {valid.length > 0 && (
        <Button type="button" variant="ghost" onClick={() => setPath(valid.slice(0, -1))}>
          <ChevronLeft aria-hidden />
          Back
        </Button>
      )}
      <h3 ref={heading} tabIndex={-1} className="text-lg font-semibold">
        {active?.label ?? 'Settings'}
      </h3>
      {active?.content}
      <nav aria-label="Drawer sections" className="space-y-2">
        {items.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant="outline"
            className="w-full justify-between"
            onClick={() => setPath([...valid, item.id])}
          >
            {item.label}
            <ChevronRight aria-hidden className="size-4" />
          </Button>
        ))}
      </nav>
    </div>
  );
}

export function SettingsDrawer({
  sections,
  ...props
}: Omit<ModalProps, 'children'> & { sections: DrawerSection[] }) {
  return (
    <DetailsPanel {...props}>
      <DrawerNavigation sections={sections} />
    </DetailsPanel>
  );
}

export function DrawerHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="space-y-2 border-b pb-5">
      <h3 className="text-xl font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {children}
    </header>
  );
}

export function DrawerFooter({ children }: { children: ReactNode }) {
  return <footer className="flex flex-wrap justify-end gap-2">{children}</footer>;
}
