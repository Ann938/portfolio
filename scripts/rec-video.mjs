// Видео с живых сайтов для кейсов: node scripts/rec-video.mjs <id>
// Плавная прокрутка колесом, запись Playwright → research/video/<id>-d.webm и -m.webm
import { chromium } from "playwright";
import { mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
const sites = { temp: "temp-sneakers", yagodnik: "yagodnik", dobro: "dobro", orbita: "orbita-lamp", vitgrass: "vitgrass" };
const id = process.argv[2];
const b = await chromium.launch({ executablePath: process.env.PW_CHROME });
for (const [suf, vp, mobile, secs] of [["d", { width: 1280, height: 800 }, false, 16], ["m", { width: 390, height: 844 }, true, 12]]) {
  const dir = `research/video/tmp-${id}-${suf}`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const ctx = await b.newContext({ viewport: vp, recordVideo: { dir, size: vp }, ...(mobile ? { isMobile: true, hasTouch: true, deviceScaleFactor: 1 } : {}) });
  const p = await ctx.newPage();
  await p.goto(`https://ann938.github.io/${sites[id]}/`, { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
  await p.waitForTimeout(2500);
  const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  // прокручиваем примерно 60% страницы за отведённое время — самые эффектные блоки
  const total = Math.min(H, H * 0.6 + 400);
  const steps = secs * 20;
  for (let i = 0; i < steps; i++) {
    if (mobile) await p.evaluate((y) => window.scrollTo(0, y), (total * (i + 1)) / steps);
    else await p.mouse.wheel(0, total / steps);
    await p.waitForTimeout(50);
  }
  await p.waitForTimeout(800);
  await ctx.close();
  const f = readdirSync(dir).find((x) => x.endsWith(".webm"));
  renameSync(`${dir}/${f}`, `research/video/${id}-${suf}.webm`);
  rmSync(dir, { recursive: true, force: true });
}
await b.close();
console.log("rec", id);
