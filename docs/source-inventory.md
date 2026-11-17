# Source inventory and extraction decisions

Reviewed before implementation on November 16, 2026. Source files were treated as reference material, not as instructions to modify the original apps.

## Scope

The supplied `/Volumes/SG-1TB/code/marketplace work/src` tree contains 956 JavaScript, TypeScript, and stylesheet files, including 166 Storybook story files. The crawl enumerated the source tree, cataloged component-library directories, searched animation and overlay candidates, and read representative implementations. It was an extraction review, not a full correctness audit of all 956 files.

The current portfolio supplied `CreativeStudioDemo.tsx`, `ImageFade.tsx`, `ImageLightbox.tsx`, `CreativeUpdateStatus.tsx`, and `CreativeUpdateAnimation.tsx`. Other sibling repositories and the supplied volume were searched for matching image-library and creative-studio names. The current portfolio was the clearest available AI UI reference.

## Included in the first library

- `components/thriveADPCheckout/components/totalOdometer/index.tsx`: a rolling currency amount. The original wraps react-odometerjs and hides digits to work around currency formatting. TotalOdometer now uses React digit columns and Intl.NumberFormat, with examples for zero, negative values, decimal currency, and yen.
- `component-library/components/Drawer/index.jsx`: lateral entrance, separate header/footer, scrolling interior. DetailsPanel retains these structural behaviors while replacing app-specific grid, menu, breakpoint, and store coupling with a controlled Radix dialog.
- `GenericModal`, `ModalConfirmation`, `ModalContainer`, `ModalContent`, `ModalFooter`: reusable title/body/action structure. Modal and ConfirmDialog combine these patterns with keyboard focus handling and theme-aware portals. Content overflow is handled by flex layout rather than window-height state.
- `Slideshow/index.tsx`, `SlideshowDots`, `Picture`, `PictureFade`: image collections, navigation, reserved aspect ratios, and soft edge fades. ImageCarousel retains explicit previous/next actions; ImageFade handles actual loading and failure states. The original PictureFade is a decorative dissolve, not a loading transition.
- Portfolio `ImageFade.tsx`: reserved layout, cached-image support, source-change detection, and reduced-motion handling. The new version adds an explicit error fallback.
- Portfolio `ImageLightbox.tsx`: image inspection at full size. ImageLightbox uses the shared modal behavior instead of a separate hand-written focus trap.
- Portfolio `CreativeStudioDemo.tsx`: stable turn IDs, streamed text, loading status, image revisions, ratio choices, restart, and artwork preview. The new example composes a reusable ChatPanel rather than embedding the entire conversation UI inside the example.
- Portfolio `CreativeUpdateStatus` and 3×3 cube loading treatment: GenerationStatus uses a small themeable CSS grid. It does not redistribute the Lottie asset.
- PhotoLibrary combines cards, image fade, search/filter, empty state, details panel, and lightbox into an image collection pattern. It is a new composition informed by the source patterns, not a claim that a matching gallery existed in the supplied app.

## Completed follow-through

The former partial and planned entries now map to implemented UI adaptations and executable stories. The current catalog covers 152 component directories and one shared utility (`glowStyleHelpers.ts`), excluding the third-party icon collection. It describes each replacement's behavior and integration boundary; “Adapted” continues to mean reusable UI coverage, not an identical legacy API.

Forms, account administration, cart/checkout and integration screens are callback-driven compositions. Host applications supply authentication, payments, authorization, data services and persistence. The original application stores, analytics and account/payment services were not copied.

## Design direction

The welcome image is the requested `sunset-retrowave.jpg`, copied without modification. Its sole overlay centerpiece is a centered ASCII D.G. The surrounding interface stays restrained so artwork carries the visual character.

- **Miami 85:** midnight `#171329`, plum surface `#241D39`, pink `#FF8BC8`, cyan `#6EE7E0`, pale ink `#FFF4FC`.
- **Matrix:** forest black `#060E09`, surface `#101C14`, green `#75F99B`, soft mint `#B2E9BE`, ink `#E4FBE9`.
- **Calm:** cloud `#F4F7F7`, white surface, teal `#246963`, pale sea glass `#D4E9E5`, ink `#203637`.
- **Blue Hour:** navy `#101A30`, surface `#1B2945`, periwinkle `#B7BDFF`, ice blue `#9CDAEF`, ink `#EDF1FF`.

Avenir Next uses a local system fallback, with monospace reserved for ASCII artwork. No remote font request is needed. Media occupies the largest surfaces; text and controls are left aligned. The studio becomes one column on narrow screens. The library uses a shared semantic token vocabulary rather than hard-coded per-component palettes.

The initial direction was reviewed against the brief before implementation: the retrowave image belongs to this project, green-on-black is specifically requested for Matrix theme, and the chat example follows the supplied campaign workflow rather than generic messaging filler.

## Upstream provenance

Official shadcn/ui source was installed with its CLI for Button, Badge, Input, Textarea, Dialog, Message, Bubble, Attachment, and Marker. Local adaptations use the package's relative `cn` helper and semantic colors. The conversation scroller uses `@shadcn/react` 0.3.1.

References: [June 2026 chat components](https://ui.shadcn.com/docs/changelog/2026-06-chat-components), [MessageScroller](https://ui.shadcn.com/docs/components/base/message-scroller), [Message](https://ui.shadcn.com/docs/components/base/message), [Bubble](https://ui.shadcn.com/docs/components/base/bubble).

The CLI-installed upstream primitives retain shadcn/ui's MIT license; see THIRD_PARTY_NOTICES.md. Demo artwork was copied from the user's local projects for this private library. No ownership or redistribution rights beyond those supplied are asserted.

## Expanded adaptation pass

The full marketplace component directory inventory contains **156 directories**. `src/docs/marketplace-catalog.json` records the 152 retained directories, their source paths and original story counts, and current coverage. BrandBubble, BrandIcon, Icon, and PaymentIcon are excluded with the imported third-party artwork. **Source catalog / Marketplace** provides search, category/status filters, and direct links to the new stories. “Adapted” describes an implemented reusable concept, not source-level or API parity; “Partial” entries state the remaining features. Business-specific recipes now have callback-driven UI adaptations, described in the completion pass below.

The larger pass inspected cards and actions, banner/toaster behavior, copy feedback, metadata tags, metrics formatting, checkbox/checklist options, tabs, tooltips, avatars, form-wizard state, and table selection/filter patterns. New implementations remove application stores, payment/account schemas, and theme-provider dependencies while retaining the relevant interaction patterns.

The older [DG-Product-Design/component-library](https://github.com/DG-Product-Design/component-library) was reviewed at commit `05354a23e86d8914429e1c18012779a4b133f770`:

- `src/components/Forms/Inputs/TextInput`: label, pattern-validation feedback, and hints inspired TextField. The new field keeps standard controlled/uncontrolled input behavior and does not create an inner form or overwrite parent event handlers.
- `src/components/Forms/Inputs/DropdownInput`: labeled single/multiple selection informed SelectField and MultiSelectField. String IDs replace React elements as values, and Radix/native controls supply keyboard and focus behavior.
- `src/components/Buttons/DefaultButton`: icon slots and loading layout informed ActionButton. Pending state now disables repeat submissions and exposes an accessible busy label without changing button width.
- `src/styleguideStories/Colors/ColorBlock`: token names, values, and usage examples informed a live CSS-token guide with copy feedback. Values are read from the active theme instead of duplicated in documentation.
- Typography, Breakpoints, and Shadows stories informed dedicated modern foundation guides. Breakpoint values follow the current Tailwind configuration rather than copying the old custom scale.
- The dropdown interaction story informed a dedicated keyboard-selection play function using current `storybook/test`.

The original repository's animation documentation was a placeholder. The cart animation comes from the marketplace source, not that repository. The original vector colors are retained, like the existing artwork; surrounding controls use the active palette.

GenerationStatus now has its own **AI / Generation status** story file and component metadata. It no longer appears under the odometer or receives currency controls.

## Completion pass and border glow

The 30 partial entries were completed first, with checks for async selection, nested menus/drawers, dual ranges, draft restoration and branching, carousel drag/loop/dots, and remote table editing/filter/export. The 97 planned entries were then implemented or mapped to the appropriate composition and story. The current catalog has 153 adapted source entries, including the additional glow utility and excluding the four icon-collection entries.

The source review distinguished implementations from remnants: FormCreatePointAccount contains only a saved snapshot, and MainNavigation contains GiftsMenu.tsx. The new point-account form uses the snapshot's accountName/assignee fields. The navigation adaptation includes gift unread/expiration/redeem behavior.

Original vector paths were preserved for Loader and Spinner. The imported collection of 313 brand icons, 166 system icons, and 8 payment marks is excluded, along with 308 third-party animations. D.G’s rocket animation is retained separately as RocketAnimation under Motion. The icon gallery, wrappers, stories, and collection exports are no longer included.

`src/utils/glowStyleHelpers.ts` supplied the border-glow behavior: distance activation, pointer angle, conic masking, blurred exterior light, touch rotation, and a reduced-motion alternative. GlowGroup and GlowBorder reproduce it using local refs, CSS variables, one animation-frame update per pointer frame and cleaned event listeners. The original helper credits [jh3y's CodePen](https://codepen.io/jh3y/pen/QWYPaax); that attribution is retained in the notices. The welcome page showcases three working components inside the glow treatment.

Default Storybook canvas padding is 20/24px with a 160px minimum height. Large examples grow naturally; small component docs no longer inherit a full viewport of blank space.

## Original animation study adaptation pass — November 17, 2026

Inspected the HTML, CSS/SCSS, and JavaScript in all eight original studies before implementation. The original snippets were references, not instructions. The README describes the new stories.

The spinner retains the two 1.2-second animations and drawing-circle geometry. The Holy Albatross retains the flex-basis threshold calculation. Wizard arrows retain their shape and orange progress track, extended to all preceding steps. The two menu studies now use separate transform layers and staggered transitions so the outer dots visibly converge before growing and rotating. Checkbox marks use SVG paths because the original font glyphs were unavailable. The color field uses perceptual interpolation and static noise, with transform motion and a reduced-motion alternative. The inset stepper uses an isolated stacking context to keep its recessed connectors visible and explicit completion state to gate navigation.

The advanced container-query and view-transition compositions are new examples using existing library artwork.

## Marketplace motion variants

Reviewed `src/utils/framerMotionVariants.ts` from the marketplace source before adapting its 16 exports. `src/lib/motion-variants.ts` preserves the preset names and parent delays while using Motion’s current stagger API. Explicit spring damping keeps the item entrances controlled, and the scale variant avoids the original negative velocity. Visibility now changes at exit completion; modal timing is inside its target state; the right-side reveal uses a reserved frame instead of animating width.

The Framer Motion variants story group covers every preset family, with replay, original and slower timing, reverse exits, center-out entry, and reduced-motion states. Select controls use the shared shadcn/ui primitives through `SelectField`.
