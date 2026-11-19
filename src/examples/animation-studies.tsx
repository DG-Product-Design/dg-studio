import { useEffect, useId, useState } from "react";
import {
  BriefcaseBusiness,
  Contact,
  Minus,
  Plus,
  UserRound,
  Users,
} from "lucide-react";
import {
  WizardSteps,
  InsetStepper,
  type WizardStepsProps,
} from "../components/wizard-steps";
import {
  DotMenuButton,
  type DotMenuButtonProps,
} from "../components/dot-menu-button";
import { AnimatedCheckbox } from "../components/animated-checkbox";
import { ColorFlow, type ColorFlowProps } from "../components/color-flow";
import { Button } from "../components/ui/button";

export const identitySteps = [
  { id: "identity", label: "Identity", icon: <UserRound size={18} /> },
  { id: "contact", label: "Contact", icon: <Contact size={18} /> },
  {
    id: "employment",
    label: "Employment",
    icon: <BriefcaseBusiness size={18} />,
  },
  { id: "dependents", label: "Dependents", icon: <Users size={18} /> },
];
export function ArrowWizardDemo({
  completedColor,
}: Pick<WizardStepsProps, "completedColor">) {
  const [currentId, setCurrentId] = useState("contact");
  const current = identitySteps.findIndex((step) => step.id === currentId);
  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">A clear next step</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose any step. The orange track marks every step before your current
          position.
        </p>
      </header>
      <WizardSteps
        steps={identitySteps}
        currentId={currentId}
        onStepChange={setCurrentId}
        completedColor={completedColor}
      />
      <div className="rounded-xl border bg-card p-6">
        <p className="text-xs text-muted-foreground">Step {current + 1} of 4</p>
        <h2 className="mt-2 text-xl font-semibold">
          {identitySteps[current].label}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your form content belongs here. Selection is independent of form
          validation.
        </p>
      </div>
      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={current === 0}
          onClick={() => setCurrentId(identitySteps[current - 1].id)}
        >
          Previous step
        </Button>
        <Button
          disabled={current === 3}
          onClick={() => setCurrentId(identitySteps[current + 1].id)}
        >
          Next step
        </Button>
      </div>
    </section>
  );
}
const progressSteps = ["Details", "Artwork", "Review", "Publish"].map(
  (label) => ({ id: label.toLowerCase(), label }),
);
export function InsetProgressDemo() {
  const [current, setCurrent] = useState(0),
    [completed, setCompleted] = useState(0);
  return (
    <section className="mx-auto max-w-3xl space-y-8 rounded-2xl border bg-background p-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Collection setup
        </p>
        <h1 className="mt-2 text-2xl font-semibold">From draft to published</h1>
      </header>
      <InsetStepper
        steps={progressSteps}
        currentStep={current}
        completedCount={completed}
        onStepChange={setCurrent}
      />
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold">
          {completed === 4
            ? "Collection published"
            : progressSteps[current].label}
        </h2>
        <p role="status" className="mt-2 text-sm text-muted-foreground">
          {completed} of 4 steps complete
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {completed === 4
            ? "Every step is complete. You can revisit any part of your collection."
            : "Complete this step to unlock the next. Earlier steps remain available."}
        </p>
      </div>
      <div className="flex flex-wrap justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setCurrent(0);
            setCompleted(0);
          }}
        >
          Start over
        </Button>
        {completed < 4 && (
          <Button
            onClick={() => {
              setCompleted(Math.max(completed, current + 1));
              setCurrent(Math.min(3, current + 1));
            }}
          >
            {current < completed
              ? "Continue"
              : current === 3
                ? "Publish collection"
                : "Complete step"}
          </Button>
        )}
      </div>
    </section>
  );
}
export function DotMenuDemo({
  trigger = "click",
  ...args
}: DotMenuButtonProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <section className="max-w-md space-y-5 rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-xl font-semibold">Three dots, one gesture</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {trigger === "hover"
              ? "Hover to merge, stretch, and rotate. Click or use the keyboard on touch devices."
              : "Click to merge the dots into a cross."}
          </p>
        </div>
        <DotMenuButton
          {...args}
          trigger={trigger}
          open={open}
          onOpenChange={setOpen}
          aria-controls={id}
        />
      </div>
      <div
        id={id}
        className="flex min-h-28 items-center justify-center rounded-lg bg-muted/50 p-5"
        aria-live="polite"
      >
        <p className="text-sm text-muted-foreground">
          {open
            ? "Open · dots merged into a cross"
            : "Closed · three separate dots"}
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        240ms merge, then 240ms stretch and turn. Escape closes; reduced motion
        changes state immediately.
      </p>
    </section>
  );
}
export function CheckboxSelectionDemo() {
  const choices = ["Campaign artwork", "Social crops", "Original source files"];
  const [selected, setSelected] = useState([choices[0]]);
  return (
    <fieldset className="max-w-md space-y-5 rounded-xl border bg-card p-6">
      <legend className="px-2 font-semibold">Include in export</legend>
      <AnimatedCheckbox
        label="Select all files"
        checked={selected.length === choices.length}
        indeterminate={selected.length > 0 && selected.length < choices.length}
        onChange={(e) => setSelected(e.target.checked ? choices : [])}
      />
      <div className="space-y-4 border-t pt-5">
        {choices.map((choice) => (
          <AnimatedCheckbox
            key={choice}
            label={choice}
            checked={selected.includes(choice)}
            onChange={(e) =>
              setSelected(
                e.target.checked
                  ? [...selected, choice]
                  : selected.filter((value) => value !== choice),
              )
            }
          />
        ))}
      </div>
      <AnimatedCheckbox label="Archived versions (unavailable)" disabled />
      <p role="status" className="text-sm text-muted-foreground">
        {selected.length} of 3 file groups selected
      </p>
    </fieldset>
  );
}
export function ColorFlowDemo({
  onTimingChange,
  ...args
}: ColorFlowProps & { onTimingChange: (duration: number) => void }) {
  const [duration, setDuration] = useState(
    Math.max(1000, args.duration ?? 10000),
  );
  useEffect(() => {
    setDuration(Math.max(1000, args.duration ?? 10000));
  }, [args.duration]);
  const changeDuration = (nextDuration: number) => {
    setDuration(nextDuration);
    onTimingChange(nextDuration);
  };
  const [paused, setPaused] = useState(false),
    [dither, setDither] = useState(true);
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">A quieter color field</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Explore the palette, duration, and easing in the Storybook controls. A
          static noise layer softens visible bands as the gradient drifts.
        </p>
      </header>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          aria-pressed={paused}
          onClick={() => setPaused((v) => !v)}
        >
          {paused ? "Resume motion" : "Pause motion"}
        </Button>
        <Button
          variant="outline"
          aria-pressed={dither}
          onClick={() => setDither((v) => !v)}
        >
          Dithering
        </Button>
        <div
          role="group"
          aria-label="Animation duration"
          className="flex items-center gap-2"
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Decrease duration by one second"
            title="Decrease duration · faster motion"
            disabled={duration <= 1000}
            onClick={() => changeDuration(Math.max(1000, duration - 1000))}
          >
            <Minus aria-hidden="true" />
          </Button>
          <output
            aria-live="polite"
            aria-label="Duration per direction"
            className="min-w-24 text-center text-sm tabular-nums"
          >
            {duration / 1000}s each way
          </output>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Increase duration by one second"
            title="Increase duration · slower motion"
            disabled={duration >= 60000}
            onClick={() => changeDuration(Math.min(60000, duration + 1000))}
          >
            <Plus aria-hidden="true" />
          </Button>
        </div>
      </div>
      <ColorFlow {...args} duration={duration} dither={dither} paused={paused}>
        <div className="flex min-h-64 flex-col justify-end">
          <p className="text-xs font-semibold uppercase tracking-widest">
            Color study / 01
          </p>
          <h2 className="mt-3 max-w-sm text-4xl font-semibold leading-tight">
            Give the color room to breathe.
          </h2>
        </div>
      </ColorFlow>
      <p className="text-xs text-muted-foreground">
        {duration / 1000}s each way · {(duration * 2) / 1000}s round trip ·{" "}
        {args.timingFunction ?? "ease-in-out"}. Reduced motion holds the field
        still. Dithering softens bands; display bit depth still affects the
        result.
      </p>
    </section>
  );
}
