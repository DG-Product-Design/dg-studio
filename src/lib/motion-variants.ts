import { stagger, type TargetAndTransition } from "motion/react";

/** Animation variants, using Framer Motion’s orchestration API. */
export type MotionVariantSet = Record<string, TargetAndTransition>;
export interface StaggerVariantOptions {
  /** Seconds between entering children. */
  interval?: number;
  /** Seconds before the first child enters. */
  delay?: number;
  /** Seconds between exiting children; closing runs from the last child. */
  exitInterval?: number;
  from?: "first" | "last" | "center";
}
export function createStaggerVariants({
  interval = 0.07,
  delay = 0.15,
  exitInterval = 0.05,
  from = "first",
}: StaggerVariantOptions = {}): MotionVariantSet {
  return {
    closed: {
      transition: {
        delayChildren: stagger(Math.max(0, exitInterval), { from: "last" }),
      },
    },
    open: {
      transition: {
        delayChildren: stagger(Math.max(0, interval), {
          startDelay: Math.max(0, delay),
          from,
        }),
      },
    },
  };
}
export const listMotionVariants = createStaggerVariants();
export const listMotionVariantsNoDelay = createStaggerVariants({ delay: 0 });
export const listMotionVariantsDelay = createStaggerVariants({ delay: 0.5 });
export const tileAndGraphWrapperVariants = createStaggerVariants({
  interval: 0.03,
  delay: 0.2,
});

function listItem(offset: number): MotionVariantSet {
  return {
    closed: {
      opacity: 0,
      y: offset,
      scale: 1,
      pointerEvents: "none",
      transition: { y: { type: "spring", stiffness: 1000, damping: 40 } },
      transitionEnd: { visibility: "hidden" },
    },
    open: {
      visibility: "visible",
      pointerEvents: "auto",
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        y: { type: "spring", stiffness: 1000, damping: 40, velocity: -100 },
      },
    },
  };
}
export const listItemMotionVariants = listItem(50);
export const listItemMotionVariantsReverse = listItem(-50);
export const listItemMotionScale: MotionVariantSet = {
  closed: {
    scale: 0,
    y: 0,
    opacity: 0,
    pointerEvents: "none",
    transition: { type: "spring", stiffness: 1000, damping: 40 },
    transitionEnd: { visibility: "hidden" },
  },
  open: {
    scale: 1,
    y: 0,
    opacity: 1,
    visibility: "visible",
    pointerEvents: "auto",
    transition: { type: "spring", stiffness: 1000, damping: 40 },
  },
};
export const slidePanelUpVariants: MotionVariantSet = {
  closed: {
    opacity: 0,
    y: "110%",
    transition: { delayChildren: stagger(0.05, { from: "last" }) },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      type: "spring",
      bounce: 0.25,
      delayChildren: stagger(0.07, { startDelay: 0.2 }),
    },
  },
};
export const slidePanelUpDelayVariants: MotionVariantSet = {
  closed: {
    y: "110%",
    transition: { delayChildren: stagger(0.05, { from: "last" }) },
  },
  open: {
    y: 0,
    transition: {
      delay: 0.25,
      duration: 0.5,
      type: "spring",
      bounce: 0.3,
      delayChildren: stagger(0.15, { startDelay: 2 }),
    },
  },
};
export const slideVendorDetailsUpVariants: MotionVariantSet = {
  closed: {
    y: "110%",
    transition: { delayChildren: stagger(0.05, { from: "last" }) },
  },
  open: {
    y: 0,
    transition: {
      delay: 0.25,
      duration: 0.5,
      type: "spring",
      bounce: 0.3,
      delayChildren: stagger(0.15, { startDelay: 0.25 }),
    },
  },
};
/** Uses a reserved frame and transforms instead of animating maxWidth. */
export const slideFromRight: MotionVariantSet = {
  hidden: {
    opacity: 0,
    x: "100%",
    transition: { duration: 0.25, type: "spring", bounce: 0.5 },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.25, duration: 0.25, type: "spring", bounce: 0.5 },
  },
};
export const scaleItemNoDelayVariants: MotionVariantSet = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: { duration: 0.25, type: "spring", bounce: 0.3 },
  },
};
export const scaleItemVariants: MotionVariantSet = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: {
      delay: 0.25,
      duration: 0.25,
      type: "spring",
      bounce: 0.3,
      delayChildren: 0.25,
    },
  },
};
export const fadeInVariants: MotionVariantSet = {
  closed: {
    opacity: 0,
    transition: { duration: 0.25, type: "spring", bounce: 0.1 },
  },
  open: {
    opacity: 1,
    transition: { duration: 0.25, type: "spring", bounce: 0.1 },
  },
};
export const filterBarFadeInAnim: MotionVariantSet = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.5, type: "spring", bounce: 0.1 },
  },
  visible: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.5, type: "spring", bounce: 0.1 },
  },
};
/** Transition belongs to a target state, rather than a variant named "transition". */
export const modalOpenVariants: MotionVariantSet = {
  closed: {
    scale: 0,
    transition: { duration: 0.25, type: "spring", bounce: 0.3 },
  },
  open: {
    scale: 1,
    transition: { delay: 0.5, duration: 0.25, type: "spring", bounce: 0.3 },
  },
};

/** Immediate states with no transform movement or stagger wait, for static variant sets. */
export function reduceMotionVariants(
  variants: MotionVariantSet,
): MotionVariantSet {
  return Object.fromEntries(
    Object.entries(variants).map(([name, target]) => {
      const hidden = ["closed", "hidden", "initial"].includes(name);
      const result: TargetAndTransition = {
        ...target,
        ...target.transitionEnd,
        transition: { type: "tween", duration: 0, delay: 0, delayChildren: 0 },
      };
      // Immediate states must not leave a deferred visibility write behind.
      delete result.transitionEnd;
      for (const axis of ["x", "y", "rotate", "rotateX", "rotateY"] as const)
        if (axis in target) result[axis] = 0;
      if ("scale" in target) result.scale = 1;
      if (
        "opacity" in target ||
        "scale" in target ||
        "x" in target ||
        "y" in target
      )
        result.opacity = hidden ? 0 : 1;
      return [name, result];
    }),
  );
}
