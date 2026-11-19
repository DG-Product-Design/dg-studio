import { useEffect, useRef, useState } from 'react';
import type { AnimationItem } from 'lottie-web';

/** D.G's original rocket artwork, loaded independently of the removed icon collection. */
export function RocketAnimation({
  size = 128,
  loop = false,
  playing = true,
  label = 'Rocket animation',
}: {
  size?: number;
  loop?: boolean;
  playing?: boolean;
  label?: string;
}) {
  const container = useRef<HTMLSpanElement>(null);
  const player = useRef<AnimationItem | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let disposed = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    function sync() {
      if (reduced.matches || !playing) player.current?.goToAndStop(0, true);
      else player.current?.play();
    }

    setFailed(false);
    void Promise.all([import('lottie-web'), import('../assets/rocket-animation.json')])
      .then(([{ default: lottie }, { default: data }]) => {
        if (disposed || !container.current) return;
        player.current = lottie.loadAnimation({
          container: container.current,
          renderer: 'svg',
          loop,
          autoplay: false,
          animationData: structuredClone(data),
        });
        player.current.addEventListener('DOMLoaded', sync);
        sync();
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });
    reduced.addEventListener('change', sync);

    return () => {
      disposed = true;
      reduced.removeEventListener('change', sync);
      player.current?.destroy();
      player.current = null;
    };
  }, [loop, playing]);

  return (
    <span
      role="img"
      aria-label={label}
      className="inline-block shrink-0"
      style={{ width: size, height: size }}
    >
      {failed ? (
        <span className="grid size-full place-items-center text-xs">{label}</span>
      ) : (
        <span ref={container} aria-hidden className="block size-full" />
      )}
    </span>
  );
}
