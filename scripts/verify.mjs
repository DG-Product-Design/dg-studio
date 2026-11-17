import assert from "node:assert/strict";
import { verifyPlanned } from "./verify-planned.mjs";
import { verifyMarketplace } from "./verify-marketplace.mjs";
import { verifyLibrary } from "./verify-library.mjs";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, extname, sep } from "node:path";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const root = resolve("storybook-static");
const mime = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
const server = createServer(async (req, res) => {
  try {
    const path = resolve(
      root,
      `.${new URL(req.url, "http://localhost").pathname === "/" ? "/index.html" : new URL(req.url, "http://localhost").pathname}`,
    );
    if (!path.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    const content = await readFile(path);
    res
      .writeHead(200, {
        "Content-Type": mime[extname(path)] ?? "application/octet-stream",
      })
      .end(content);
  } catch {
    res.writeHead(404).end("Not found");
  }
});
await new Promise((done, reject) => {
  server.once("error", reject);
  server.listen(6007, "127.0.0.1", done);
});
const chrome =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
let browser;
const results = [];
try {
  browser = await chromium.launch({
    headless: true,
    ...(existsSync(chrome) ? { executablePath: chrome } : {}),
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await mkdir("test-results", { recursive: true });
  async function story(id, theme = "miami-85") {
    // This runner owns axe scans; prevent the addon from racing the same axe instance.
    // Normal Storybook browsing and Vitest retain automatic accessibility checks.
    await page.goto(
      `http://127.0.0.1:6007/iframe.html?id=${id}&viewMode=story&globals=theme:${theme};a11y.manual:!true`,
    );
    await page.locator("#storybook-root .dg-theme").first().waitFor();
    await page.waitForFunction(() => document.fonts.status === "loaded");
  }
  async function settleImages() {
    await page.waitForFunction(() =>
      Array.from(document.images).every((img) => img.complete),
    );
    await page.waitForTimeout(550); // Allow the documented image fade to complete for screenshots.
  }
  async function audit(label) {
    const scan = await new AxeBuilder({ page })
      .include(".dg-theme")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    results.push({ label, violations: scan.violations });
    assert.deepEqual(
      scan.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      [],
      label,
    );
  }
  if (
    !process.argv.includes("--marketplace") &&
    !process.argv.includes("--planned")
  ) {
    const index = JSON.parse(
      await readFile(resolve(root, "index.json"), "utf8"),
    );
    for (const entry of Object.values(index.entries).filter(
      (e) => e.type === "story",
    )) {
      await story(entry.id);
      assert.equal(
        await page.locator(".sb-errordisplay").isVisible(),
        false,
        entry.id,
      );
    }
    console.log("All story render checks passed.");
    for (const theme of ["miami-85", "matrix", "calm", "blue-hour"]) {
      for (const id of [
        "welcome--start-here",
        "foundations-themes--primitives",
        "media-photo-library--default",
        "examples-creative-studio--default",
      ]) {
        await story(id, theme);
        await audit(`${id}/${theme}`);
      }
      await story("overlays-details-panel--default", theme);
      await page.getByRole("button", { name: "Open details" }).click();
      await page.getByRole("dialog").waitFor();
      assert.equal(
        await page.getByRole("dialog").getAttribute("data-theme"),
        theme,
      );
      await audit(`details-open/${theme}`);
      await page.keyboard.press("Escape");
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      await page.waitForFunction(
        () => document.activeElement?.textContent === "Open details",
      );
      assert.equal(
        await page
          .getByRole("button", { name: "Open details" })
          .evaluate((e) => e === document.activeElement),
        true,
      );
    }
    console.log("Four-theme accessibility and portal checks passed.");
    await page.emulateMedia({ colorScheme: "dark" });
    await story("foundations-themes--primitives", "calm");
    await audit("calm-on-dark-system");
    await page.emulateMedia({ colorScheme: "light" });
    await story("media-photo-library--default");
    await page.getByRole("textbox", { name: "Search images" }).fill("neon");
    assert.equal(
      await page.getByRole("button", { name: /View details/ }).count(),
      1,
    );
    await page
      .getByRole("button", { name: "View details for After the sunset" })
      .click();
    await page.getByRole("dialog").waitFor();
    await page.getByRole("button", { name: "Open full image" }).click();
    await page.getByRole("dialog", { name: "After the sunset" }).waitFor();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Open full image" }).waitFor();
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => {
      const focused = document.activeElement;
      const ids = focused?.getAttribute("aria-labelledby")?.split(" ") ?? [];
      return ids
        .map((id) => document.getElementById(id)?.textContent)
        .join(" ")
        .includes("View details for After the sunset");
    });
    await page
      .getByRole("textbox", { name: "Search images" })
      .fill("nothing-matches");
    await page.getByRole("heading", { name: "No matching images" }).waitFor();
    await page.getByRole("button", { name: "Clear filters" }).click();
    assert.equal(
      await page.getByRole("button", { name: /View details/ }).count(),
      6,
    );
    await story("media-image-fade--failed");
    await page.getByRole("img", { name: /Image unavailable/ }).waitFor();
    await story("media-image-fade--source-change");
    await page.waitForFunction(
      () =>
        document.querySelector("[data-image-state]")?.dataset.imageState ===
        "loaded",
    );
    await page.getByRole("button", { name: "Change source" }).click();
    await page.waitForFunction(
      () =>
        document.querySelector("img")?.src.includes("dusk") &&
        document.querySelector("[data-image-state]")?.dataset.imageState ===
          "loaded",
    );
    await story("media-carousel--default");
    await page.getByRole("button", { name: "Next image" }).click();
    assert.match(await page.getByRole("status").innerText(), /2 of 3/);
    await story("motion-total-odometer--interactive");
    await page.getByRole("button", { name: "Add $49.95", exact: true }).click();
    assert.ok(await page.getByText("$1,334.45", { exact: true }).count());
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    assert.ok(await page.getByText("$0.00", { exact: true }).count());
    await story("overlays-details-panel--confirmation");
    await page
      .getByRole("button", { name: "Archive collection", exact: true })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Archive collection", exact: true })
      .click();
    await page.getByText("Collection archived.", { exact: true }).waitFor();
    await story("ai-chat-panel--composer");
    await page
      .getByRole("textbox", { name: "Message", exact: true })
      .fill("A summer campaign");
    await page.getByRole("button", { name: "Send message" }).click();
    await page
      .getByRole("status")
      .filter({ hasText: "A summer campaign (0 attachments)" })
      .waitFor();
    await story("examples-creative-studio--default");
    await page
      .getByRole("button", { name: "Try a dusk palette", exact: true })
      .click();
    await page.getByRole("button", { name: "Stop response" }).waitFor();
    await page
      .getByRole("button", { name: "Try a dusk palette", exact: true })
      .waitFor({ state: "visible" });
    await page.waitForFunction(
      () => !document.querySelector('button[aria-label="Stop response"]'),
    );
    await page
      .getByRole("img", { name: "Get Outside campaign in dusk colors" })
      .waitFor();
    await page
      .getByRole("button", { name: "Reframe for the feed", exact: true })
      .click();
    await page.getByRole("button", { name: "9:16", exact: true }).waitFor();
    await page.getByRole("button", { name: "9:16", exact: true }).click();
    await page.waitForFunction(
      () => !document.querySelector('button[aria-label="Stop response"]'),
    );
    await page
      .getByRole("button", { name: "Change the headline", exact: true })
      .click();
    await page.waitForFunction(
      () => !document.querySelector('button[aria-label="Stop response"]'),
    );
    await page
      .getByRole("img", {
        name: "Take the Scenic Route campaign in dusk colors",
      })
      .waitFor();
    await page
      .getByRole("button", { name: "Add my brand logo", exact: true })
      .click();
    await page.waitForFunction(
      () => !document.querySelector('button[aria-label="Stop response"]'),
    );
    await page.getByText("△ TRAILBOUND", { exact: true }).waitFor();
    await settleImages();
    await page.screenshot({
      path: "test-results/creative-studio-desktop.png",
      fullPage: true,
    });
    await page.getByRole("button", { name: "Restart demo" }).click();
    await page
      .getByRole("button", { name: "Try a dusk palette", exact: true })
      .click();
    await page.getByRole("button", { name: "Stop response" }).click();
    await page.getByRole("button", { name: "Restart demo" }).click();
    assert.equal(await page.getByRole("article").count(), 1);
    console.log(
      "Media, modal, odometer, composer, and creative workflow checks passed.",
    );
    await story("welcome--start-here");
    await settleImages();
    await page.screenshot({
      path: "test-results/welcome-desktop.png",
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    for (const id of [
      "welcome--start-here",
      "media-photo-library--default",
      "examples-creative-studio--default",
    ]) {
      await story(id);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        true,
        `Mobile overflow: ${id}`,
      );
      await settleImages();
      await page.screenshot({
        path: `test-results/${id}-mobile.png`,
        fullPage: true,
      });
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await story("ai-generation-status--updating-creative");
    assert.equal(
      await page
        .locator(".dg-loader > span")
        .first()
        .evaluate((e) => getComputedStyle(e).animationName),
      "none",
    );
    await verifyLibrary({ page, context, story, audit });
  }
  if (!process.argv.includes("--planned"))
    await verifyMarketplace({ page, context, story, audit });
  await verifyPlanned({ page, context, story, audit });
  assert.deepEqual(errors, [], "Browser runtime errors");
  console.log(
    "Mobile layouts, reduced motion, and browser error checks passed.",
  );
} finally {
  await mkdir("test-results", { recursive: true });
  await writeFile(
    "test-results/accessibility.json",
    JSON.stringify(results, null, 2),
  );
  await browser?.close();
  await new Promise((done) => server.close(done));
}
