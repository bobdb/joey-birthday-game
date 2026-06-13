import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const playwrightCore = "C:/Users/bobdb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright-core/package.json";
const req = createRequire(playwrightCore);
const { chromium } = req("playwright-core");

const indexPath = path.join(__dirname, "src", "index.html");
const target = "file:///" + indexPath.replace(/\\/g, "/");

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

// ---- Title screenshot ----
{
  const page = await browser.newPage({ viewport: { width: 900, height: 792 } });
  await page.goto(target);
  await page.waitForSelector("#gameCanvas");
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(__dirname, "screenshot_title.png") });
  console.log("title done");
  await page.close();
}

// ---- Victory screenshot ----
// Patch game.js on the fly to expose the game instance globally
{
  const page = await browser.newPage({ viewport: { width: 900, height: 792 } });

  const gameSrc = fs.readFileSync(path.join(__dirname, "src", "game.js"), "utf8");
  const patched = gameSrc.replace(
    "requestAnimationFrame((stamp) => this.loop(stamp));",
    "requestAnimationFrame((stamp) => this.loop(stamp)); window.__g = this;"
  );

  // Serve patched game.js via route
  await page.route("**/game.js", (route) => {
    route.fulfill({ contentType: "text/javascript", body: patched });
  });

  await page.goto(target);
  await page.waitForSelector("#gameCanvas");
  await page.waitForTimeout(500);

  // Force victory
  await page.evaluate(() => {
    if (window.__g) {
      window.__g.state = "victory";
      window.__g.time = 2.4;
    }
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(__dirname, "screenshot_victory.png") });
  const found = await page.evaluate(() => !!window.__g);
  console.log("victory done, game found:", found);
  await page.close();
}

await browser.close();
