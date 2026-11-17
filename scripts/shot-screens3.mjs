// Частые снимки для подбора экранов кейсов: node scripts/shot-screens2.mjs <id>
// research/screens3/<id>/d-NN.jpg (шаг ~полэкрана), m-NN.jpg, страницы p-*.jpg, светлая тема l-NN.jpg
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const sites = {
  temp: { path: "temp-sneakers", pages: ["checkout/", "delivery/", "returns/", "contacts/"], light: true },
  yagodnik: { path: "yagodnik", pages: [] },
  dobro: { path: "dobro", pages: ["friends/", "stories/", "stories/lada/", "blog/", "blog/first-week/"] },
  orbita: { path: "orbita-lamp", pages: [] },
  vitgrass: { path: "vitgrass", pages: [] },
};
const id = process.argv[2];
const s = sites[id];
const dir = `research/screens3/${id}`;
mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.PW_CHROME });
const base = `https://ann938.github.io/${s.path}/`;
const pad = (n) => String(n).padStart(2, "0");

async function frames(pre, vp, mobile, theme) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, ...(mobile ? { isMobile: true, hasTouch: true } : {}) });
  if (theme) await ctx.addInitScript((t) => { try { localStorage.setItem("temp:theme", t); } catch {} }, theme);
  const p = await ctx.newPage();
  await p.goto(base, { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
  await p.waitForTimeout(4000);
  const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const step = Math.round(vp.height * (mobile ? 0.8 : 0.5));
  let k = 0, y = 0;
  for (;;) {
    await p.screenshot({ path: `${dir}/${pre}-${pad(k++)}.jpg`, type: "jpeg", quality: 88 });
    if (y >= H || k > 60) break;
    y = Math.min(H, y + step);
    if (mobile) await p.evaluate((t) => window.scrollTo(0, t), y);
    else { let cur = await p.evaluate(() => scrollY); while (cur < y - 30) { await p.mouse.wheel(0, 150); await p.waitForTimeout(50); const nc = await p.evaluate(() => scrollY); if (nc === cur) break; cur = nc; } }
    await p.waitForTimeout(1300);
  }
  if (!theme) for (const pg of s.pages) {
    await p.goto(base + pg, { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `${dir}/p${pre}-${pg.replace(/\//g, "_")}.jpg`, type: "jpeg", quality: 88 });
  }
  await ctx.close();
}
await frames("d", { width: 1440, height: 900 }, false);
if (!process.env.NOMOB) await frames("m", { width: 390, height: 844 }, true);
if (s.light) await frames("l", { width: 1440, height: 900 }, false, "light");
await b.close();
console.log("done", id);
