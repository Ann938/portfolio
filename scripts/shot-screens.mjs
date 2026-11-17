// Экраны разделов для страниц кейсов: прокрутка колесом (чтобы сработали скролл-анимации) и снимки вьюпорта.
// node scripts/shot-screens.mjs [id] → research/screens/<id>/d-<n>.jpg, m-<n>.jpg
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const sites = {
  temp: { path: "temp-sneakers", extra: ["checkout/"] },
  yagodnik: { path: "yagodnik", extra: [] },
  dobro: { path: "dobro", extra: ["friends/", "stories/lada/", "blog/first-week/"] },
  orbita: { path: "orbita-lamp", extra: [] },
  vitgrass: { path: "vitgrass", extra: [] },
};
const only = process.argv[2];
const b = await chromium.launch({ executablePath: process.env.PW_CHROME });
for (const [id, s] of Object.entries(sites)) {
  if (only && id !== only) continue;
  const dir = `research/screens/${id}`;
  mkdirSync(dir, { recursive: true });
  for (const [pre, vp, n] of [["d", { width: 1440, height: 900 }, 10], ["m", { width: 390, height: 844 }, 8]]) {
    const p = await b.newPage({ viewport: vp, ...(pre === "m" ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
    const base = `https://ann938.github.io/${s.path}/`;
    await p.goto(base, { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
    await p.waitForTimeout(4000);
    const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (let k = 0; k < n; k++) {
      const target = Math.round((H * k) / (n - 1));
      if (pre === "d") {
        let cur = await p.evaluate(() => scrollY);
        while (cur < target - 50) { await p.mouse.wheel(0, 250); await p.waitForTimeout(60); const nc = await p.evaluate(() => scrollY); if (nc === cur) break; cur = nc; }
      } else {
        await p.evaluate((t) => window.scrollTo(0, t), target);
      }
      await p.waitForTimeout(1600);
      await p.screenshot({ path: `${dir}/${pre}-${k}.jpg`, type: "jpeg", quality: 80 });
    }
    for (const [j, e] of s.extra.entries()) {
      await p.goto(base + e, { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
      await p.waitForTimeout(3000);
      await p.screenshot({ path: `${dir}/${pre}-x${j}.jpg`, type: "jpeg", quality: 80 });
    }
    await p.close();
  }
  console.log("done", id);
}
await b.close();
