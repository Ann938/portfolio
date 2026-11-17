// Обложки кейсов: снимки опубликованных сайтов (ДВ и МВ): node scripts/shot-cases.mjs
import { chromium } from "playwright";
const sites = { temp: "temp-sneakers", yagodnik: "yagodnik", dobro: "dobro", orbita: "orbita-lamp", vitgrass: "vitgrass" };
const b = await chromium.launch({ executablePath: process.env.PW_CHROME });
for (const [id, path] of Object.entries(sites)) {
  for (const [suf, vp] of [["", { width: 1440, height: 900 }], ["-m", { width: 390, height: 844 }]]) {
    const p = await b.newPage({ viewport: vp, deviceScaleFactor: suf ? 2 : 1, ...(suf ? { isMobile: true, hasTouch: true } : {}) });
    try {
      await p.goto(`https://ann938.github.io/${path}/`, { waitUntil: "networkidle", timeout: 60000 });
    } catch (e) { console.log(id, suf, "timeout"); }
    await p.waitForTimeout(4500);
    await p.screenshot({ path: `public/cases/${id}${suf}.jpg`, type: "jpeg", quality: 82 });
    await p.close();
    console.log(id, suf || "dv");
  }
}
await b.close();
