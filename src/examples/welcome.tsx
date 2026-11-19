import { useState } from 'react';
import { ArrowUpRight, Images, MessageSquare, Layers, Move, RotateCcw } from 'lucide-react';
import { GlowBorder, GlowGroup } from '../components/glow-border';
import { TotalOdometer } from '../components/motion';
import { ImageFade } from '../components/image-fade';
import { CartAnimation } from '../components/cart-animation';
import { Button } from '../components/ui/button';
import { assets } from './assets';

const ascii = `
██████╗     ██████╗
██╔══██╗   ██╔════╝
██║  ██║   ██║  ███╗
██║  ██║   ██║   ██║
██████╔╝██╗╚██████╔╝
╚═════╝ ╚═╝ ╚═════╝
`.trim();

export function Welcome() {
  const [image, setImage] = useState(0);
  const [total, setTotal] = useState(1240);
  const [replay, setReplay] = useState(0);

  return (
    <main className="mx-auto max-w-6xl">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <span className="text-lg font-semibold tracking-tight">D.G / Studio UI</span>
        <span className="text-xs text-muted-foreground">A working collection, by David George</span>
      </header>
      <div className="relative isolate overflow-hidden rounded-2xl">
        <img
          src="./images/welcome.jpg"
          alt="Retrowave sunset above a neon wireframe landscape"
          width={850}
          height={680}
          className="h-[clamp(250px,38vh,390px)] w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 flex items-center justify-center">
          <pre
            aria-label="D.G"
            role="img"
            className="w-fit select-none font-mono text-md leading-none font-bold tracking-normal text-white"
          >
            {ascii}
          </pre>
        </div>
      </div>
      <div className="py-8 flex flex-col gap-12 mb-10">
        <div className="flex flex-wrap gap-10 md:flex-nowrap">
          <h1 className="max-w-md text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl shrink-0">
            Beautiful interfaces.
            <br />
            Intuitive experiences.
          </h1>
          <div className="self-end">
            <p className="text-base leading-relaxed text-muted-foreground">
              Welcome! This is a collection of recreated components that I've built over my career
              (the ones I can remember at least). Usually, when working on a project, I am 110%
              focused on the project at hand. This presents a challenge as I usually only think of
              updating my portfolio when it's time to look for a new project.
            </p>
          </div>
        </div>
        <p className="font-semibold text-muted-foreground w-full max-w-lg mx-auto text-pretty text-center">
          Take a look around! Move your mouse across the borders below. Try the Storybook controls.
          Choose a palette in the toolbar.
        </p>
      </div>
      <GlowGroup className="grid gap-5 md:grid-cols-3" spread={100}>
        <GlowBorder>
          <section className="flex h-full flex-col p-5">
            <div className="mb-5">
              <h2 className="font-semibold">Image reveal</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Prevent CLS with a soft load transition, preserving aspect ratio, and blurring the
                background on containment.
              </p>
            </div>
            <ImageFade
              blurBg
              src={assets[image].src}
              alt={assets[image].alt}
              width={18}
              height={9}
              imageClassName="object-cover"
            />
            <Button
              type="button"
              variant="outline"
              className="mt-5 w-full"
              onClick={() => setImage((i) => (i + 1) % assets.length)}
            >
              Change artwork
            </Button>
          </section>
        </GlowBorder>
        <GlowBorder>
          <section className="flex h-full flex-col p-5">
            <div>
              <h2 className="font-semibold">Precision in motion</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                A familiar number, carefully animated.
              </p>
            </div>
            <div className="grid min-h-36 flex-1 place-items-center py-6">
              <TotalOdometer value={total} className="text-4xl lg:text-5xl" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-5 w-full"
              onClick={() => setTotal((n) => (n === 1240 ? 2895.75 : 1240))}
            >
              Update total
            </Button>
          </section>
        </GlowBorder>
        <GlowBorder>
          <section className="flex h-full flex-col p-5">
            <div>
              <h2 className="font-semibold">A little character</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Original marketplace cart animation.
              </p>
            </div>
            <div className="grid min-h-36 flex-1 place-items-center py-3">
              <div role="img" aria-label="Cart animation">
                <CartAnimation key={replay} size={130} active={replay > 0} />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-5 w-full"
              onClick={() => setReplay((n) => n + 1)}
            >
              <RotateCcw aria-hidden className="size-4" />
              Play illustration
            </Button>
          </section>
        </GlowBorder>
      </GlowGroup>
      <div className="mt-4 text-right">
        <a
          target="_top"
          href="./?path=/story/motion-border-glow--default"
          className="rounded text-xs text-primary underline underline-offset-4"
        >
          Explore the border glow
        </a>
      </div>
      <nav
        aria-label="Explore the library"
        className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          {
            title: 'Image library',
            detail: 'Browse, filter, and look closer',
            id: 'media-photo-library--default',
            Icon: Images,
          },
          {
            title: 'Creative studio',
            detail: 'A conversation that makes things',
            id: 'examples-creative-studio--default',
            Icon: MessageSquare,
          },
          {
            title: 'Overlays',
            detail: 'Details without losing your place',
            id: 'overlays-details-panel--default',
            Icon: Layers,
          },
          {
            title: 'Motion',
            detail: 'A little movement, with purpose',
            id: 'motion-total-odometer--interactive',
            Icon: Move,
          },
        ].map(({ title, detail, id, Icon }) => (
          <a
            key={id}
            href={`./?path=/story/${id}`}
            target="_top"
            className="group rounded-xl border p-5 hover:bg-accent"
          >
            <div className="mb-5 flex justify-between text-primary">
              <Icon aria-hidden className="size-5" />
              <ArrowUpRight aria-hidden className="size-4" />
            </div>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
          </a>
        ))}
      </nav>
      <footer className="mt-8 flex flex-wrap justify-between gap-3 border-t pt-5 text-xs text-muted-foreground">
        <span>React · TypeScript · Tailwind · shadcn/ui</span>
        <span>Miami 85 / The Matrix / Calm / Blue Hour</span>
      </footer>
    </main>
  );
}
