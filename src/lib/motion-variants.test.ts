import { describe, expect, it } from "vitest";
import {
  createStaggerVariants,
  listMotionVariants,
  listMotionVariantsDelay,
  listMotionVariantsNoDelay,
  tileAndGraphWrapperVariants,
  listItemMotionVariants,
  listItemMotionScale,
  modalOpenVariants,
  slidePanelUpDelayVariants,
  reduceMotionVariants,
  type MotionVariantSet,
} from "./motion-variants";
function delays(variants: MotionVariantSet, state: string, count = 4) {
  const delay = variants[state].transition?.delayChildren;
  if (typeof delay !== "function")
    throw new Error("Expected a stagger delay function");
  return Array.from({ length: count }, (_, index) => delay(index, count));
}
describe("marketplace motion variants", () => {
  it("keeps the original entry timing and reverses the exit sequence", () => {
    const enter = delays(listMotionVariants, "open");
    [0.15, 0.22, 0.29, 0.36].forEach((value, index) =>
      expect(enter[index]).toBeCloseTo(value),
    );
    const exit = delays(listMotionVariants, "closed");
    [0.15, 0.1, 0.05, 0].forEach((value, index) =>
      expect(exit[index]).toBeCloseTo(value),
    );
    expect(delays(listMotionVariantsNoDelay, "open")[0]).toBe(0);
    expect(delays(listMotionVariantsDelay, "open")[0]).toBe(0.5);
    expect(delays(tileAndGraphWrapperVariants, "open")[1]).toBeCloseTo(0.23);
  });
  it("distributes center-out and last-first delays symmetrically", () => {
    const center = delays(
      createStaggerVariants({ interval: 0.2, delay: 0, from: "center" }),
      "open",
      5,
    );
    expect(center).toEqual([0.4, 0.2, 0, 0.2, 0.4]);
    const last = delays(
      createStaggerVariants({ interval: 0.2, delay: 0, from: "last" }),
      "open",
      3,
    );
    expect(last).toEqual([0.4, 0.2, 0]);
  });
  it("keeps exiting children visible until the fade finishes", () => {
    expect(listItemMotionVariants.closed.visibility).not.toBe("hidden");
    expect(listItemMotionVariants.closed.transitionEnd?.visibility).toBe(
      "hidden",
    );
    expect(listItemMotionVariants.open.visibility).toBe("visible");
    expect(listItemMotionVariants.closed.pointerEvents).toBe("none");
  });
  it("removes transform movement and nested delays without mutating the originals", () => {
    for (const variants of [
      listMotionVariants,
      listItemMotionVariants,
      listItemMotionScale,
      slidePanelUpDelayVariants,
      modalOpenVariants,
    ]) {
      const reduced = reduceMotionVariants(variants);
      for (const target of Object.values(reduced)) {
        expect(target.transition).toEqual({
          type: "tween",
          duration: 0,
          delay: 0,
          delayChildren: 0,
        });
        if ("y" in target) expect(target.y).toBe(0);
        if ("scale" in target) expect(target.scale).toBe(1);
      }
      if ("scale" in variants.closed) expect(reduced.closed.opacity).toBe(0);
    }
    expect(reduceMotionVariants(listItemMotionVariants).closed.visibility).toBe(
      "hidden",
    );
    expect(
      reduceMotionVariants(listItemMotionVariants).closed.transitionEnd,
    ).toBeUndefined();
    expect(slidePanelUpDelayVariants.closed.y).toBe("110%");
    expect(delays(slidePanelUpDelayVariants, "open")[0]).toBe(2);
    expect(modalOpenVariants.closed.scale).toBe(0);
  });
  it("puts modal timing inside the open state rather than treating transition as a variant", () => {
    expect(modalOpenVariants.transition).toBeUndefined();
    expect(modalOpenVariants.open.transition?.delay).toBe(0.5);
  });
});
