import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium } from "playwright";
const vite = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  appType: "custom",
});
let browser;
try {
  const { Loader } = await vite.ssrLoadModule("/src/components/loaders.tsx");
  const markup = renderToStaticMarkup(
    createElement(Loader, {
      size: 150,
      backgroundColor: "#461276",
      foregroundColor: "white",
    }),
  );
  const reference = await readFile(
    "src/test/fixtures/marketplace-loader.html",
    "utf8",
  );
  const css = await readFile("src/styles.css", "utf8");
  const chrome =
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  browser = await chromium.launch({
    headless: true,
    ...(existsSync(chrome) ? { executablePath: chrome } : {}),
  });
  const context = await browser.newContext({
    viewport: { width: 400, height: 400 },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const original = await context.newPage(),
    current = await context.newPage();
  const base =
    "<style>body{margin:0;background:white}#sample{position:relative;width:150px;height:178px;background:white}#sample>svg{position:absolute;left:0;top:0;display:block} :root{--primary:#461276;--muted:#eeeeee}.text-primary{color:var(--primary)}</style>";
  await original.setContent(base + '<div id="sample">' + reference + "</div>");
  await current.setContent(
    base + "<style>" + css + '</style><div id="sample">' + markup + "</div>",
  );
  // Keep identical framing, including when the SVG rotates or scales.
  await current.evaluate(() => {
    const sample = document.querySelector("#sample");
    sample.replaceChildren(sample.querySelector("svg"));
  });
  await mkdir("test-results/loader", { recursive: true });
  const mismatches = [];
  for (const time of [0, 250, 1000, 1250, 1500, 1750, 2000, 3000, 4500, 6000]) {
    for (const page of [original, current])
      await page.evaluate((time) => {
        for (const a of document
          .querySelector("#sample")
          .getAnimations({ subtree: true })) {
          a.pause();
          a.currentTime = time;
        }
      }, time);
    const expected = await original.locator("#sample").screenshot({
      path: `test-results/loader/original-${time}.png`,
      animations: "allow",
    });
    const actual = await current.locator("#sample").screenshot({
      path: `test-results/loader/current-${time}.png`,
      animations: "allow",
    });
    if (!actual.equals(expected)) mismatches.push(time);
  }
  console.log("Original-frame mismatches (ms):", mismatches);
  assert.deepEqual(
    mismatches,
    [],
    "Loader must match the original reveal, rotation, mask, and waves at every sampled frame.",
  );
  await current.emulateMedia({ reducedMotion: "reduce" });
  const reduced = await current.locator("svg").evaluate((svg) => ({
    animations: svg.getAnimations({ subtree: true }).length,
    opacity: getComputedStyle(svg).opacity,
    mask: getComputedStyle(svg.querySelector("mask rect")).transform,
  }));
  assert.equal(reduced.animations, 0);
  assert.equal(reduced.opacity, "1");
  assert.equal(reduced.mask, "matrix(1, 0, 0, 1, 0, 0)");
  console.log(
    "10 original animation frames match pixel-for-pixel; reduced motion shows a static finished mark.",
  );
} finally {
  await browser?.close();
  await vite.close();
}
