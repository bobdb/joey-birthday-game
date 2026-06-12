import { createRequire } from "node:module";

const require = createRequire("C:/Users/bobdb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json");
const { chromium } = require("playwright");

const target = new URL("../src/index.html", import.meta.url).href;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
const errors = [];

page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));

await page.goto(target);
await page.waitForSelector("#gameCanvas");
await page.mouse.click(550, 610);
await page.keyboard.press("ArrowUp");
await page.waitForTimeout(350);
const state = await page.evaluate(() => {
  const canvas = document.querySelector("#gameCanvas");
  const ctx = canvas.getContext("2d");
  const pixel = [...ctx.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data];
  return {
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    nonBlankCenter: pixel.slice(0, 3).some((value) => value !== 0),
    muteText: document.querySelector("#muteButton")?.textContent,
  };
});

await browser.close();

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({ target, ...state }, null, 2));
