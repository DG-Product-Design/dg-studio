import { useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, type AnimationDefinition } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ImageFade } from '../components/image-fade';
import { SelectField } from '../components/fields';
import { assets } from './assets';
import {
  createStaggerVariants,
  reduceMotionVariants,
  listMotionVariants,
  listMotionVariantsNoDelay,
  listMotionVariantsDelay,
  tileAndGraphWrapperVariants,
  listItemMotionVariants,
  listItemMotionVariantsReverse,
  listItemMotionScale,
  slidePanelUpVariants,
  slidePanelUpDelayVariants,
  slideVendorDetailsUpVariants,
  slideFromRight,
  scaleItemNoDelayVariants,
  scaleItemVariants,
  fadeInVariants,
  filterBarFadeInAnim,
  modalOpenVariants,
} from '../lib/motion-variants';

type Phase = 'opening' | 'open' | 'closing' | 'closed';

/** Replay waits for the actual exit completion, not a timeout or a remount. */
function usePlayback() {
  const [phase, setPhase] = useState<Phase>('opening');
  const replayAfterClose = useRef(false);
  const target = phase === 'closing' || phase === 'closed' ? 'closed' : 'open';
  const busy = phase === 'opening' || phase === 'closing';

  return {
    phase,
    target,
    busy,
    complete(definition: AnimationDefinition) {
      if (definition !== target) return;
      if (definition === 'closed' && replayAfterClose.current) {
        replayAfterClose.current = false;
        setPhase('opening');
      } else setPhase(definition === 'open' ? 'open' : 'closed');
    },
    toggle() {
      if (!busy) {
        replayAfterClose.current = false;
        setPhase(target === 'open' ? 'closing' : 'opening');
      }
    },
    replay() {
      if (!busy) {
        replayAfterClose.current = target === 'open';
        setPhase(target === 'open' ? 'closing' : 'opening');
      }
    },
  };
}

type Playback = ReturnType<typeof usePlayback>;

function PlaybackControls({ playback }: { playback: Playback }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="secondary"
        className="transition-colors"
        disabled={playback.busy}
        onClick={playback.replay}
      >
        <RotateCcw size={16} aria-hidden />
        Replay animation
      </Button>
      <Button
        variant="outline"
        className="transition-colors"
        disabled={playback.busy}
        onClick={playback.toggle}
      >
        {playback.target === 'open' ? 'Hide items' : 'Show items'}
      </Button>
      <p role="status" className="text-sm text-muted-foreground">
        {
          {
            opening: 'Revealing items…',
            open: 'All items visible',
            closing: 'Hiding items…',
            closed: 'Items hidden',
          }[playback.phase]
        }
      </p>
    </div>
  );
}

function StudyHeader({
  title,
  children,
  reduced,
}: {
  title: string;
  children: ReactNode;
  reduced: boolean;
}) {
  return (
    <header className="max-w-3xl space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
      {reduced && (
        <p className="text-sm font-medium">
          Reduced motion: immediate state changes, with no stagger delay.
        </p>
      )}
    </header>
  );
}

function Artwork({ index, label, number }: { index: number; label?: string; number?: boolean }) {
  const asset = assets[index % assets.length];

  return (
    <>
      <ImageFade
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        blurBg
        aspectRatio="3 / 4"
        className="rounded-none"
      />
      <div className="space-y-2 p-3">
        <div className="flex items-center gap-2">
          {number && (
            <span className="inline-grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
              {index + 1}
            </span>
          )}
          <h2 className="text-sm font-semibold leading-snug">{label ?? asset.title}</h2>
        </div>
        <p className="text-xs text-muted-foreground">{asset.collection}</p>
      </div>
    </>
  );
}

const timingPresets = {
  study: {
    label: 'Study · 180ms',
    interval: 0.18,
    delay: 0.15,
    source: 'createStaggerVariants',
  },
  original: {
    label: 'Original · 70ms',
    interval: 0.07,
    delay: 0.15,
    source: 'listMotionVariants',
  },
  immediate: {
    label: 'No start delay · 70ms',
    interval: 0.07,
    delay: 0,
    source: 'listMotionVariantsNoDelay',
  },
  delayed: {
    label: 'Delayed start · 500ms',
    interval: 0.07,
    delay: 0.5,
    source: 'listMotionVariantsDelay',
  },
  metrics: {
    label: 'Metrics · 30ms',
    interval: 0.03,
    delay: 0.2,
    source: 'tileAndGraphWrapperVariants',
  },
};

type Timing = keyof typeof timingPresets;

const itemVariants = {
  rise: listItemMotionVariants,
  drop: listItemMotionVariantsReverse,
  scale: listItemMotionScale,
};

type ItemEffect = keyof typeof itemVariants;

export interface StaggerStudyProps {
  initialTiming?: Timing;
  initialOrigin?: 'first' | 'last' | 'center';
  initialEffect?: ItemEffect;
  reduceMotion?: boolean;
}

export function StaggerStudy({
  initialTiming = 'original',
  initialOrigin = 'first',
  initialEffect = 'rise',
  reduceMotion = false,
}: StaggerStudyProps) {
  const prefersReduced = useReducedMotion();
  const reduced = reduceMotion || !!prefersReduced;
  const playback = usePlayback();
  const [timing, setTiming] = useState<Timing>(initialTiming);
  const [origin, setOrigin] = useState(initialOrigin);
  const [effect, setEffect] = useState<ItemEffect>(initialEffect);
  const preset = timingPresets[timing];
  const variants = {
    study: createStaggerVariants({ interval: 0.18, from: origin }),
    original: listMotionVariants,
    immediate: listMotionVariantsNoDelay,
    delayed: listMotionVariantsDelay,
    metrics: tileAndGraphWrapperVariants,
  }[timing];

  return (
    <main
      className="mx-auto max-w-6xl space-y-6"
      data-motion-study="stagger"
      data-phase={playback.phase}
    >
      <StudyHeader title="One collection. One unfolding sequence." reduced={reduced}>
        The parent starts the sequence; each artwork inherits its variant. Watch the order on entry,
        then the reverse order on exit. The study pace gives each arrival room to register.
      </StudyHeader>
      <div className="flex flex-wrap gap-4">
        <SelectField
          label="Timing"
          className="w-52 max-w-full"
          value={timing}
          disabled={playback.busy}
          onValueChange={(value) => setTiming(value as Timing)}
          options={Object.entries(timingPresets).map(([value, preset]) => ({
            value,
            label: preset.label,
          }))}
        />
        <SelectField
          label="Start from"
          className="w-48 max-w-full"
          value={timing === 'study' ? origin : 'first'}
          disabled={playback.busy || timing !== 'study'}
          onValueChange={(value) => setOrigin(value as typeof origin)}
          options={[
            { value: 'first', label: 'First artwork' },
            { value: 'last', label: 'Last artwork' },
            { value: 'center', label: 'Center outward' },
          ]}
        />
        <SelectField
          label="Item motion"
          className="w-52 max-w-full"
          value={effect}
          disabled={playback.busy}
          onValueChange={(value) => setEffect(value as ItemEffect)}
          options={[
            { value: 'rise', label: 'Rise into place' },
            { value: 'drop', label: 'Drop into place' },
            { value: 'scale', label: 'Scale into place' },
          ]}
        />
      </div>
      <PlaybackControls playback={playback} />
      <div className="dg-stagger-stage rounded-xl border bg-muted/20 p-3 sm:p-4">
        <motion.ol
          aria-label="Animated artwork collection"
          aria-hidden={playback.target === 'closed'}
          inert={playback.phase !== 'open'}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
          initial="closed"
          animate={playback.target}
          variants={reduced ? reduceMotionVariants(variants) : variants}
          onAnimationComplete={playback.complete}
        >
          {assets.map((asset, index) => (
            <motion.li
              key={asset.id}
              data-stagger-item={index}
              variants={reduced ? reduceMotionVariants(itemVariants[effect]) : itemVariants[effect]}
              className="overflow-hidden rounded-lg border bg-card"
            >
              <Artwork index={index} number />
            </motion.li>
          ))}
        </motion.ol>
      </div>
      <div className="flex flex-wrap justify-between gap-3 text-xs text-muted-foreground">
        <p>
          {reduced
            ? 'No delay'
            : `${Math.round(preset.delay * 1000)}ms lead-in · ${Math.round(preset.interval * 1000)}ms between artworks`}{' '}
          · {preset.source}
        </p>
        <p>Change a setting, then replay. Closing runs last to first.</p>
      </div>
    </main>
  );
}

export function ItemEntranceStudy() {
  const reduced = !!useReducedMotion();
  const playback = usePlayback();

  const parent = createStaggerVariants({ interval: 0.25 });

  return (
    <main className="mx-auto max-w-3xl space-y-6" data-phase={playback.phase}>
      <StudyHeader title="Three ways to arrive" reduced={reduced}>
        The same parent sequence, with different child variants: a rise, a drop, and a spring scale.
      </StudyHeader>
      <PlaybackControls playback={playback} />
      <motion.div
        aria-label="Item entrance comparison"
        aria-hidden={playback.target === 'closed'}
        inert={playback.phase !== 'open'}
        initial="closed"
        animate={playback.target}
        variants={reduced ? reduceMotionVariants(parent) : parent}
        onAnimationComplete={playback.complete}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {Object.entries(itemVariants).map(([name, variants], index) => (
          <motion.article
            key={name}
            variants={reduced ? reduceMotionVariants(variants) : variants}
            className="overflow-hidden rounded-xl border bg-card"
          >
            <Artwork
              index={index}
              label={
                {
                  rise: 'Rise from below',
                  drop: 'Drop from above',
                  scale: 'Spring scale',
                }[name]
              }
            />
          </motion.article>
        ))}
      </motion.div>
    </main>
  );
}

const panelPresets = {
  standard: {
    title: 'Panel, then content',
    detail: 'A half-second spring reveal, followed by a 70ms child stagger after a 200ms lead-in.',
    variants: slidePanelUpVariants,
  },
  delayed: {
    title: 'Let the panel settle',
    detail:
      'The original two-second content delay makes the panel and its contents distinct stages of the reveal.',
    variants: slidePanelUpDelayVariants,
  },
  details: {
    title: 'Details with a little rhythm',
    detail: 'The marketplace details preset: a 250ms panel delay, then 150ms between content rows.',
    variants: slideVendorDetailsUpVariants,
  },
  right: {
    title: 'Arrive from the right',
    detail:
      'A spring slide in a reserved frame. The motion uses translation and opacity, so the surrounding layout stays still.',
    variants: { closed: slideFromRight.hidden, open: slideFromRight.visible },
  },
};

export function PanelRevealStudy({ preset = 'standard' }: { preset?: keyof typeof panelPresets }) {
  return <PanelReveal key={preset} preset={preset} />;
}

function PanelReveal({ preset }: { preset: keyof typeof panelPresets }) {
  const reduced = !!useReducedMotion();
  const playback = usePlayback();

  const config = panelPresets[preset];
  const asset = assets[1];

  return (
    <main className="mx-auto max-w-4xl space-y-6" data-phase={playback.phase}>
      <StudyHeader title={config.title} reduced={reduced}>
        {config.detail}
      </StudyHeader>
      <PlaybackControls playback={playback} />
      <div className="overflow-hidden rounded-2xl border bg-muted/30 p-4 sm:p-6">
        <motion.section
          aria-label="Artwork details reveal"
          aria-hidden={playback.target === 'closed'}
          inert={playback.phase !== 'open'}
          initial="closed"
          animate={playback.target}
          variants={reduced ? reduceMotionVariants(config.variants) : config.variants}
          onAnimationComplete={playback.complete}
          className="grid gap-6 rounded-xl border bg-card p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
        >
          <ImageFade
            src={asset.src}
            alt={asset.alt}
            width={asset.width}
            height={asset.height}
            blurBg
            aspectRatio="1"
          />
          <div className="self-center space-y-4">
            <h2 className="text-2xl font-semibold">{asset.title}</h2>
            {[
              ['Collection', asset.collection],
              ['Dimensions', `${asset.width} × ${asset.height}`],
              ['Delivery', 'Ready for the campaign'],
            ].map(([label, value]) => (
              <motion.div
                key={label}
                variants={
                  reduced ? reduceMotionVariants(listItemMotionVariants) : listItemMotionVariants
                }
                className="border-t pt-3"
              >
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-sm font-medium">{value}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}

const accents = [
  {
    label: 'Immediate scale',
    variants: {
      closed: scaleItemNoDelayVariants.initial,
      open: scaleItemNoDelayVariants.animate,
    },
  },
  {
    label: 'Delayed scale',
    variants: {
      closed: scaleItemVariants.initial,
      open: scaleItemVariants.animate,
    },
  },
  { label: 'Soft fade', variants: fadeInVariants },
  {
    label: 'Delayed fade',
    variants: {
      closed: filterBarFadeInAnim.hidden,
      open: filterBarFadeInAnim.visible,
    },
  },
  { label: 'Dialog spring', variants: modalOpenVariants },
];

export function ScaleAndFadeStudy() {
  const reduced = !!useReducedMotion();
  const playback = usePlayback();

  return (
    <main className="mx-auto max-w-5xl space-y-6" data-phase={playback.phase}>
      <StudyHeader title="Small entrances, different emphasis" reduced={reduced}>
        Compare the original scale and fade presets side by side. The parent changes state once;
        each child keeps its own spring and delay.
      </StudyHeader>
      <PlaybackControls playback={playback} />
      <motion.div
        aria-label="Scale and fade comparison"
        aria-hidden={playback.target === 'closed'}
        inert={playback.phase !== 'open'}
        initial="closed"
        animate={playback.target}
        onAnimationComplete={playback.complete}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
      >
        {accents.map(({ label, variants }, index) => (
          <motion.article
            key={label}
            variants={reduced ? reduceMotionVariants(variants) : variants}
            className="overflow-hidden rounded-xl border bg-card"
          >
            <Artwork index={index} label={label} />
          </motion.article>
        ))}
      </motion.div>
    </main>
  );
}
