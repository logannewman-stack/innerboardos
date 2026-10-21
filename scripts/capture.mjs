// Recaptures every app screen the site shows, from the live app (Practice by InnerBoard, practiceinnerboard.com),
// as raw PNGs at twice the CSS size: the phone at 390 x 844 (780 x 1688 px), the desk at 1440 x 900 (2880 x 1800).
// Then `node scripts/encode.mjs <rawDir>` writes the files in public/app.
//
// Read only: it opens pages and scrolls them, scores the Company OS Score and fills a Role Blueprint the way a
// visitor would (a visitor's answers stay in this browser's storage, which is thrown away), and takes screenshots.
// Nothing is submitted, no account is used.
//
// Needs Playwright, which the site does not install:
//   npm i --no-save playwright && npx playwright install chromium     (or set CHROME=/path/to/chrome)
//   node scripts/capture.mjs /tmp/ios-captures [https://practiceinnerboard.com]
//
// The result screens carry the day they are scored ("Scored Oct 21, 2026" in the shipped files).
//
// Every shot is checked for the app's availability notes ("not available yet", "not open in the app yet", "aren't
// posted yet", "coming soon", "opens soon"): the site never shows one, so a shot with one in view is reported.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const [out, base = "https://practiceinnerboard.com"] = process.argv.slice(2);
if (!out) { console.error("usage: node scripts/capture.mjs <rawDir> [baseUrl]"); process.exit(1); }
mkdirSync(out, { recursive: true });

/* The Company OS Score as captured: ten statements scored 8, 6, 7, 5, 8, 6, 7, 5, 6, 7 (the app's sample reading). */
const PICKS = [8, 6, 7, 5, 8, 6, 7, 5, 6, 7];
/* The Role Blueprint, filled in for one role. */
const BLUEPRINT = ["Operations lead", "Keeps the week's jobs scheduled, staffed and closed out.", "Every job closes within two days of completion.",
  "Schedule set by Friday for the following week.", "Crew assignments confirmed by Sunday night.", "Close-out paperwork filed within 48 hours."];
const NOTES = /not available|not open|aren.t posted|coming soon|opens soon|being written/i;

/* Software GL, so the app's frosted header renders as it does in a browser. */
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
let problems = 0;

for (const [tag, vw, vh, mobile] of [["phone", 390, 844, true], ["desk", 1440, 900, false]]) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile, colorScheme: "light" });
  await ctx.addInitScript(() => { try { localStorage.setItem("innerboard.theme", "light"); } catch { /* storage off */ } });
  const page = await ctx.newPage();
  const dismiss = async () => {
    for (let k = 0; k < 2; k++) {
      const b = page.locator("button").filter({ hasText: /^(i understand|got it)/i }).first();
      if (await b.count() && await b.isVisible().catch(() => false)) { await b.click(); await page.waitForTimeout(500); } else break;
    }
  };
  const go = async (route) => {
    await page.goto(base + route, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(1500); await dismiss();
    await page.addStyleTag({ content: "[data-sonner-toaster], [data-sonner-toast] { display: none !important; }" }).catch(() => {});
    await page.mouse.move(vw - 3, Math.round(vh / 2));
  };
  const to = async (y) => { await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y); await page.waitForTimeout(1300); };
  const bottom = () => page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  /* `fadeY`: notes below this CSS y are allowed, as encode.mjs fades the frame to ivory from there. */
  const shot = async (name, fadeY = Infinity) => {
    const seen = await page.evaluate(([src, fadeY]) => {
      const re = new RegExp(src, "i"), hits = [], w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        if (!re.test(n.textContent)) continue;
        const rg = document.createRange(); rg.selectNodeContents(n);
        if ([...rg.getClientRects()].some((r) => r.width > 0 && r.bottom > 0 && r.top < Math.min(innerHeight, fadeY))) hits.push(n.textContent.trim().slice(0, 50));
      }
      return hits;
    }, [NOTES.source, fadeY]);
    await page.screenshot({ path: join(out, `${name}.png`) });
    if (seen.length) problems++;
    console.log(`${name}.png${seen.length ? `  AVAILABILITY NOTE IN VIEW: ${seen.join(" | ")}` : ""}`);
  };
  const prefix = mobile ? "" : "desk-";

  // Every screen is taken as a first visit sees it, before the score below is taken.
  // The Assessments page of InnerBoard OS (the hero's third screen; phone only).
  if (mobile) { await go("/company/assessments"); await to(0); await shot("os-assessments"); }

  // The Track (Develop). Captured October 20, 2026; the live app has since folded the Track into The Book (/track
  // opens /book), so when it redirects the shot is skipped and the shipped track-home files stay as they are.
  await go("/track");
  if (new URL(page.url()).pathname === "/track") { await to(0); await shot(`${prefix}track-home`); }
  else console.log(`${prefix}track-home.png  SKIPPED: /track now opens ${new URL(page.url()).pathname}; keep the shipped capture or choose another Develop screen`);

  // The Role Blueprint, filled in for one role.
  await go("/leader/blueprint/new");
  const fields = page.locator("textarea:visible, input[type=text]:visible, input:not([type]):visible");
  const n = Math.min(await fields.count(), BLUEPRINT.length);
  for (let i = 0; i < n; i++) { await fields.nth(i).click(); await fields.nth(i).fill(BLUEPRINT[i]); }
  await to(0); await shot(`${prefix}leader-blueprint`);

  // The Curriculum (InnerBoard OS): the phone from its top and at its foot (stitched on the site at 75.64 em), the
  // desk with the crew row resting on the window's foot.
  await go("/company/curriculum");
  if (mobile) { await to(0); await shot("os-curriculum"); await to(await bottom()); await shot("os-curriculum-2"); }
  else {
    const crew = await page.evaluate(() => {
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) if (/^Running this with a crew\?$/.test(n.textContent.trim())) {
        let el = n.parentElement; while (el && el !== document.body && !(parseFloat(getComputedStyle(el).borderTopWidth) > 0 && el.getBoundingClientRect().width > 250)) el = el.parentElement;
        return Math.round((el || n.parentElement).getBoundingClientRect().bottom + scrollY);
      }
      return null;
    });
    await to(crew ? Math.max(0, crew - vh + 6) : await bottom()); await shot("desk-os-curriculum");
  }

  // Get Certified (the certifications hub).
  await go("/certifications"); await to(0); await shot(`${prefix}get-certified`, mobile ? Infinity : 635);

  // Last, as it changes what the other screens show (the Track and the Assessments page read the score): the
  // Company OS Score, scored; then what the score means.
  await go("/book/upstream");
  for (let i = 0; i < PICKS.length; i++) {
    const b = page.locator("button").filter({ hasText: new RegExp(`^${PICKS[i]}$`) }).nth(i);
    await b.scrollIntoViewIfNeeded(); await b.click(); await page.waitForTimeout(150);
  }
  /* Offsets where nothing behind the app's frosted header meets the screen's top edge. */
  await to(mobile ? 700 : 576); await shot(`${prefix}score-upstream-scored`);
  if (mobile) { await to(1700); await shot("score-upstream-scored-2"); }
  await page.locator("button:visible").filter({ hasText: /^see what/i }).first().click();
  await page.waitForTimeout(1500);
  if (mobile) { await to(0); await shot("score-upstream-result"); await to(await bottom()); await shot("score-upstream-result-2"); }
  else { await to(await bottom()); await shot("desk-score-upstream-lowest"); }

  await ctx.close();
}
await browser.close();
if (problems) { console.error(`${problems} shot(s) with an availability note in view`); process.exit(1); }
console.log(`done: raw captures in ${out}; next, node scripts/encode.mjs ${out}`);
