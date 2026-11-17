// Скриншот страницы целиком с прокруткой (чтобы сработали появления): node scripts/shot.mjs <path> <out> [w h]
import { chromium } from "playwright";
const [path, out, w, h] = [process.argv[2], process.argv[3], +(process.argv[4] || 1440), +(process.argv[5] || 900)];
const b = await chromium.launch({ executablePath: process.env.PW_CHROME });
const p = await b.newPage({ viewport: { width: w, height: h }, ...(w < 800 ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
const errs = []; p.on("pageerror", (e) => errs.push(String(e))); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await p.goto(`http://localhost:3700${path}`, { waitUntil: "networkidle", timeout: 90000 });
await p.waitForTimeout(1200);
await p.screenshot({ path: `${out}-1.jpg`, type: "jpeg", quality: 78 });
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 400) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(70); }
await p.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((e) => e.setAttribute("data-revealed", "")));
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800);
await p.screenshot({ path: `${out}-full.jpg`, type: "jpeg", quality: 70, fullPage: true });
const sw = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log(path, w, "hscroll", sw, errs.slice(0, 5));
await b.close();
