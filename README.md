# D.G Studio UI

A React component library for photo collections, creative tools, and conversations. Built with TypeScript, Tailwind CSS 4, shadcn/ui, and Storybook 10.

- 152 components
- 242 Storybook stories
- 16 named motion presets
- 4 themes

## Start

Use Node 22.12 or newer. A `.nvmrc` selects the installed Node 22.15 release.

```sh
nvm use
npm install
npm run storybook
```

Storybook opens at http://localhost:6006. Start at **Welcome / Start Here** and use the **Theme** toolbar to switch between Miami 85, Matrix, Calm, and Blue Hour. The selection applies to stories, documentation previews, and portaled overlays.

## Use in another project

```sh
npm install ../dg-studio-ui
```

Build this library first with `npm run build`, then import the compiled components and stylesheet:

```tsx
import { ImageFade, ThemeProvider } from "@dg/studio-ui";
import "@dg/studio-ui/styles.css";

export function Preview() {
  return (
    <ThemeProvider theme="calm">
      <ImageFade
        src="/photos/sunset.jpg"
        alt="Sunset over the mountains"
        width={1200}
        height={800}
      />
    </ThemeProvider>
  );
}
```

`ImageFade` accepts `aspectRatio` (for example, `"16 / 9"` or `1`) to set its container shape. Set `blurBg` to fit the full image inside that frame and fill unused space with a blurred copy. Without these props, it keeps the existing width/height ratio and cover behavior. See Media → Image fade, Marketplace hero, and Carousel in Storybook.

The compiled stylesheet includes component utilities; consuming applications do not need Tailwind to use this package. React and React DOM remain peer dependencies. Demo artwork and example-specific state stay out of the package entry point. The package is private until you choose a distribution and licensing policy.

## Earlier-library adaptations

The source catalog maps **152 component directories plus the shared border-glow utility** to implemented UI components and compositions. The third-party icon collection is excluded. All remaining entries have an adaptation and story. This is a TypeScript UI migration, not source/API parity or a copy of the original application services.

The library includes labeled text and selection fields, checklists, switches, radio cards, ranges, loading buttons, collapsible cards, action cards, metrics, avatars, removable tags, banners, toast/undo, clipboard feedback, skeletons, tabs, pagination, tooltips, popovers, responsive layout helpers, sortable/selectable tables, and a validated form wizard. It also preserves your original marketplace CartAnimation vector asset with lazy loading and reduced-motion handling.

The earlier library informed the live color-token guide, typography, spacing/breakpoints, elevation documentation, loading-button layout, and Storybook keyboard interaction story. The four current palettes remain the visual system.

Try **Examples / Collection settings** for validation, step navigation, delivery options, and async completion. **Examples / Collection manager** demonstrates sorting, paging, multi-row selection, and archive/undo in local state. The photo library now uses SelectField for its collection filter.

`TextField` forwards normal input events and attributes; validation belongs to the parent form. `SelectField`, `MultiSelectField`, Checklist, RadioCards, Tabs, and RangeField use controlled values. `DataTable` sorts and pages a bounded in-memory collection, or delegates page/sort state to a remote-data adapter; it does not virtualize rows. `FormWizard` keeps field state in its parent and accepts per-step validation and an async completion callback. Toast requires ToastProvider.

## Components

- **Media:** ImageFade, PhotoLibrary, ImageCarousel, ImageLightbox, EmptyState.
- **Conversation:** ChatPanel, ChatComposer, ChatMessage, and the official shadcn Message, Bubble, Attachment, Marker primitives. MessageScroller uses `@shadcn/react`.
- **Overlays:** Modal, ConfirmDialog, DetailsPanel; controlled APIs, Radix focus management, escape dismissal, independent content scrolling, and theme propagation into portals.
- **Motion:** TotalOdometer, GenerationStatus, CartAnimation, RocketAnimation, Loader, Spinner, and GlowGroup/GlowBorder. Motion responds to `prefers-reduced-motion`.
- **Foundations:** ThemeProvider, theme metadata, Button, Badge, Input, Textarea, and live color/type/layout/elevation guides.
- **Forms, content, navigation, and feedback:** see the exported components and their dedicated Storybook stories listed above.

Props and examples are available in Storybook autodocs. The **Examples / Creative studio** story composes the chat, image, and loading components into the workflow from the portfolio demo.

## Animation studies and layout recipes

The stories explore D.G’s original animation and layout studies:

- **Motion / Spinner** — drawing circle, with the original 1.2-second stroke/rotation timing and a configurable `color` or `--spinner-color`.
- **Layout recipes / Holy albatross** — container-sized flex layout, with a resizable collection and preview.
- **Navigation / Wizard steps** — arrow steps, selectable with orange tracks under all earlier steps.
- **Motion / Dot menu** — click and hover variants. The outer dots merge before growing into the cross; closing reverses the sequence.
- **Forms / Animated checkbox** — orange checkbox, using native inputs and SVG check/minus marks instead of an icon font.
- **Motion / Color flow** — changing background, with OKLCH interpolation, static noise to reduce visible banding, pause controls, and an sRGB comparison. Display bit depth and compression still influence banding.
- **Navigation / Inset stepper** — recessed progress track, with sequential unlocking, revisitable steps, and completion marks.

**Layout recipes / Container queries** demonstrates nested named containers, three card layouts, container-relative type, and density style queries. **Layout recipes / View transitions** demonstrates grid/list changes, keyed sorting/filtering, shared image/title navigation, keyboard focus restoration, and immediate updates when the API is unavailable or reduced motion is requested. These compositions stay in `src/examples/layout-recipes`; `HolyAlbatross` and the reusable controls are exported by the library.

The animation components honor reduced motion. Stories exercise selection, gating, checkboxes, disclosure state, responsive layouts, and navigation; unit tests cover native form behavior and transition failure/cleanup paths.

## Framer Motion variants

**Motion / Framer Motion variants** contains the original-timing stagger, a slower study, center-out ordering, three item entrances, four panel reveals, scale/fade comparisons, and reduced motion. Replay completes the exit before revealing again. The timing controls also include the original no-delay, delayed-list, and metrics presets.

The 16 named presets from the marketplace utility are exported from `src/lib/motion-variants.ts`. `createStaggerVariants` accepts entry spacing, lead-in, exit spacing, and direction in seconds. Use matching state names on parents and children; children should inherit the parent’s animation state:

```tsx
import { motion } from "motion/react";
import { listMotionVariants, listItemMotionVariants } from "@dg/studio-ui";

<motion.ul
  initial="closed"
  animate={open ? "open" : "closed"}
  variants={listMotionVariants}
  inert={!open}
  aria-hidden={!open}
>
  {items.map((item) => (
    <motion.li key={item.id} variants={listItemMotionVariants}>
      {item.title}
    </motion.li>
  ))}
</motion.ul>;
```

Use `reduceMotionVariants(preset)` with Motion’s `useReducedMotion()` preference to remove transforms and sequencing delays. The current [Motion orchestration API](https://motion.dev/docs/react-animation#orchestration) uses `delayChildren: stagger(...)`. Springs have explicit types and damping; scaling avoids the old negative velocity. Hidden visibility is applied after exit completion, the dialog timing belongs to its open state, and the right-hand panel uses transforms instead of animating `maxWidth`.

## Select and SelectField

**Forms / Select** documents the shared shadcn/ui primitives: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, grouping, labels, and separators. The chevron has consistent inset spacing, long values truncate without overlapping it, and portaled options inherit the active theme.

**Forms / Select field** adds labels, hints, errors, and an options-array API through `SelectField` and `SelectFieldProps`. All library consumers and story examples use this name. The motion controls and gallery collection filter use the same field component. Stories cover keyboard selection, disabled options, focus restoration, long labels, and native form submission.

## Connect chat to a model

`ChatPanel` accepts `messages`, `busy`, `onSend(text, files)`, `onStop`, and a completed-response `announcement`. It does not own network access, persistence, or credentials. Append a user message, add an assistant message, and update that assistant message by stable ID as your transport streams. Pass the final response as `announcement` to avoid reading every token aloud.

The CreativeStudio example is a local scripted adapter. Its suggestions select prepared artwork; it does not generate images. Attachments remain local File objects until your `onSend` handler uploads them. The example includes a stop action and clears timers on restart and unmount.

## Verification

```sh
npm run test:loader     # Pixel comparison with 10 preserved original Loader frames
npm run test:unit       # Fast Vitest + Testing Library tests; no browser required
npm run test:stories    # Every story, play function, and accessibility check in Chromium
npm test               # Both Vitest projects
npm run test:watch     # Vitest watch mode
npm run test:coverage  # Combined V8 coverage, including an HTML report in coverage/
npm run typecheck
npm run build
npm run build-storybook
npm run test:e2e       # Existing Playwright workflows, four palettes, and mobile checks
```

The unit suite covers CSV import/export edge cases, filters, draft persistence, form validation and duplicate submissions, async search races, editable cells, and image load/error recovery. Browser tests run directly from source through the official Storybook Vitest addon; no static build or running Storybook server is required. Play functions use `storybook/test`, accessible roles, awaited user events, and named steps. Open a story's **Interactions** panel to replay its checks, or use Storybook's testing widget to run the browser suite.

Interaction stories cover the welcome showcase, glow keyboard access, modal dismissal/focus restoration, archive confirmation, wizard validation/failure, async search/create, password visibility, CSV import, checkout, chat attachments, account transfers, carousel navigation, nested menus, and table editing/paging. Default preview stories remain available for manual exploration. The accessibility addon fails tests on violations; the existing Playwright suite additionally checks the four palettes and mobile/reduced-motion behavior.

Browser tests use `CHROME_PATH` when provided, fall back to installed macOS Chrome, or use Playwright Chromium. On a fresh machine, run `npx playwright install chromium` (Linux CI: `npx playwright install --with-deps chromium`). Only the older `test:e2e` command needs `npm run build-storybook` first; it serves the build on port 6007 and saves screenshots/results in `test-results/`.

[The GitHub Actions workflow](.github/workflows/unit-tests.yml) runs on pushes, pull requests, and manual dispatch. It uses the Node version in `.nvmrc`, caches npm downloads, installs the lockfile with `npm ci`, checks TypeScript, and runs `npm run test:unit`. It requires no secrets or browser installation. A GitHub run starts after these files are committed and pushed to a GitHub repository.

See [the source inventory](docs/source-inventory.md) for the pre-implementation crawl, extraction decisions, and completed adaptations.

## Complete marketplace UI pass

Storybook contains **242 stories**. The expanded families include account/billing views, 19 configurable form recipes, employee CSV import/review, cart and checkout compositions, employee/program administration, metrics containers, navigation, heroes, and application frames. Search the source catalog for a direct source-to-story mapping.

The imported icon collection is excluded from this library. D.G’s original rocket is retained independently as `RocketAnimation`, with Default and Replay stories under **Motion / Rocket animation**. Interface controls use Lucide icons, which are third-party assets.

**Welcome** showcases GlowBorder around image switching, the rolling total, and a replayable original illustration. The glow follows pointer proximity/angle; touch devices use a slow orbit and reduced-motion users see a static colored border. Keyboard focus remains independently visible. Small Storybook previews now size to their contents with a 160px minimum rather than a full viewport.

```tsx
import { GlowGroup, GlowBorder, Button } from "@dg/studio-ui";

<GlowGroup className="grid gap-5 sm:grid-cols-2" proximity={80} spread={100}>
  <GlowBorder>
    <div className="p-6">
      <Button>Open collection</Button>
    </div>
  </GlowBorder>
  <GlowBorder>
    <div className="p-6">A neighboring preview</div>
  </GlowBorder>
</GlowGroup>;
```

`GlowGroup` starts with no colored glow (`idleOpacity={0}`) on pointer devices. Nearby cards fade in and out over one second, holding their last direction during fade-out. The welcome page uses these defaults; touch orbit and reduced-motion treatments remain available. **Motion / Border glow / Pointer proximity** demonstrates the sibling transition.

Use `SearchSelect`/`Typeahead` with a stable `loadOptions(query, signal)` adapter. `DataTable.remote` accepts controlled page/sort state and already-paged rows. `EditableCell` saves through an async callback; `TableFilters` and `createTableCsv` cover filtering and export. `FormWizard` accepts conditional steps and controlled progress; `useWizardDraft` explicitly persists validated draft data under a caller-supplied key.

`Form` and the named form recipes validate locally, disable duplicate submissions, await `onSubmit`, and surface failures. Override option lists and validation for your application. Authentication, HRIS, address search, order submission, authorization and payment processing remain host integrations. `CreditCardInput` hosts the payment provider's secure fields; `CardInformation` receives a payment-method token through a callback. The library does not collect or store raw card details. The Storybook checkout and administrative actions use local sample state.

`FormCreatePointAccount` was reconstructed from its saved snapshot because the supplied directory has no implementation file. `MainNavigation` adds the gifts-menu behavior actually present in that directory. These distinctions are recorded in the catalog.

Focused legacy browser checks: `npm run test:e2e -- --planned` runs the recipe/glow checks; `npm run test:e2e -- --marketplace` runs the completed partial adaptations plus the recipes. Build Storybook first.

The F `Loader` preserves the original purple/white mark, 100ms fade delay, 1s reveal delay, 3D rotation, growing mask, and two waves traveling 582px over 6s. Its original `backgroundColor`, `foregroundColor`, `scaleDuration`, `startScale`, and `waveDuration` props are available; `duration` remains an alias for `waveDuration`. **Motion / Loader / Replay** restarts the entrance, and **Themed** uses the active palette. Reduced motion displays the completed mark without movement. The welcome illustration now uses the original `CartAnimation` and can be replayed.

`npm run test:loader` compares the implementation pixel-for-pixel with an independent fixture preserved from the marketplace Loader snapshot, keyframes, and color/reset styles. It samples ten timestamps through the entrance and wave cycle in Chromium and needs no Storybook build or external source directory. Reference and current frames are saved in `test-results/loader/`.
