import { useEffect, useRef } from 'react';
import type { AnimationItem } from 'lottie-web';
import animationData from '../assets/cart-animation.json';

/** Original marketplace vector animation, loaded only when this component mounts. */
export function CartAnimation({ active, size = 64 }: { active: boolean; size?: number }) {
  const container = useRef<HTMLSpanElement>(null);
  const animation = useRef<AnimationItem | null>(null);
  const activeRef = useRef(active);
  useEffect(() => {
    let disposed = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    function sync() {
      const player = animation.current;
      if (!player) return;
      if (!activeRef.current) player.goToAndStop(0, true);
      else if (reduced.matches) player.goToAndStop(Math.max(0, player.totalFrames - 1), true);
      else player.goToAndPlay(0, true);
    }

    void import('lottie-web')
      .then(({ default: lottie }) => {
        if (disposed || !container.current) return;
        const player = lottie.loadAnimation({
          container: container.current,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: structuredClone(animationData),
        });

        animation.current = player;
        player.addEventListener('DOMLoaded', sync);
        sync();
      })
      .catch(() => {
        /* The surrounding control remains usable if animation loading fails. */
      });
    reduced.addEventListener('change', sync);

    return () => {
      disposed = true;
      reduced.removeEventListener('change', sync);
      animation.current?.destroy();
      animation.current = null;
    };
  }, []);
  useEffect(() => {
    activeRef.current = active;
    const player = animation.current;
    if (!player) return;
    if (!active) player.goToAndStop(0, true);
    else if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      player.goToAndStop(Math.max(0, player.totalFrames - 1), true);
    else player.goToAndPlay(0, true);
  }, [active]);

  return (
    <span
      ref={container}
      aria-hidden="true"
      className="inline-block shrink-0"
      style={{ width: size, height: size }}
    />
  );
}
