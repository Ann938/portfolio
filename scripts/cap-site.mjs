// Плавное видео сайта для кейса (покадрово, с управляемым временем — см. lib-cap.mjs):
// node scripts/cap-site.mjs <id> dv|mv → research/frames/<id>-<dv|mv>/0000.jpg…
import { open } from "./lib-cap.mjs";
const sites = { temp: "temp-sneakers", yagodnik: "yagodnik", dobro: "dobro", orbita: "orbita-lamp", vitgrass: "vitgrass" };
const [id, mode] = [process.argv[2], process.argv[3] || "dv"];
const mv = mode === "mv";
const c = await open({ url: `https://ann938.github.io/${sites[id]}/`, out: `research/frames/${id}-${mode}`, w: mv ? 390 : 1440, h: mv ? 844 : 900, mobile: mv });
const { p } = c;
await p.waitForTimeout(3500);
// Добро: видео щенка в замороженном времени застревает отдельным слоем поверх страницы —
// на время съёмки подменяем его картинкой текущего кадра
await p.evaluate(() => {
  for (const v of document.querySelectorAll("video")) {
    const cv = document.createElement("canvas");
    cv.width = v.videoWidth;
    cv.height = v.videoHeight;
    try { cv.getContext("2d").drawImage(v, 0, 0); } catch {}
    const img = document.createElement("img");
    img.src = cv.toDataURL("image/jpeg", 0.92);
    img.className = v.className;
    img.style.cssText = v.style.cssText;
    v.replaceWith(img);
  }
});
await c.freeze();
const maxY = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
await c.hold(1.2);
// прокрутка примерно до середины страницы — самые эффектные блоки; скорость ровная и спокойная
await c.scrollTo(Math.round(maxY * (id === "temp" ? 0.62 : 0.5)), mv ? 9 : 12, process.argv[4] || "lenis");
await c.hold(1);
await c.close();
