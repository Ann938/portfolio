// Покадровая съёмка сайта с управляемым временем: rAF, performance.now, Date.now и CSS/WAAPI-анимации
// идут ровно на 1/30 с за кадр, сколько бы ни занимал скриншот. Так 3D, GSAP и Lenis в ролике
// движутся с настоящей скоростью.
import { chromium } from "playwright";
import fs from "node:fs";

export const FPS = 30;
const STEP = 1000 / FPS;

const TIME_HOOK = () => {
  const rp = performance.now.bind(performance), rd = Date.now;
  const rraf = window.requestAnimationFrame.bind(window), rcaf = window.cancelAnimationFrame.bind(window);
  let frozen = false, vt = 0, dBase = 0, id = 1e7;
  const q = new Map();
  const seen = new WeakSet();
  performance.now = () => (frozen ? vt : rp());
  Date.now = () => (frozen ? Math.round(dBase + vt) : rd());
  window.requestAnimationFrame = (cb) => {
    if (!frozen) return rraf(cb);
    const i = id++;
    q.set(i, cb);
    return i;
  };
  window.cancelAnimationFrame = (i) => (q.delete(i), rcaf(i));
  window.__freeze = () => {
    vt = rp();
    dBase = rd() - vt;
    frozen = true;
    for (const a of document.getAnimations()) (seen.add(a), a.pause());
  };
  window.__step = (ms) => {
    vt += ms;
    for (const a of document.getAnimations()) {
      if (!seen.has(a)) {
        seen.add(a);
        a.pause();
      } else a.currentTime = (a.currentTime || 0) + ms;
    }
    const cbs = [...q.values()];
    q.clear();
    for (const cb of cbs) {
      try {
        cb(vt);
      } catch (e) {
        console.error(e);
      }
    }
  };
  // курсор (ДВ) и касание (МВ) — рисуются поверх страницы
  window.__cur = (x, y, s, show, touch) => {
    let c = document.getElementById("__cur");
    if (!c) {
      c = document.createElement("div");
      c.id = "__cur";
      Object.assign(c.style, { position: "fixed", left: "0", top: "0", zIndex: "2147483647", pointerEvents: "none", transformOrigin: "2px 2px" });
      document.documentElement.appendChild(c);
    }
    c.innerHTML = touch
      ? `<div style="width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:50%;background:rgba(255,255,255,.55);border:2px solid rgba(0,0,0,.25);box-shadow:0 4px 14px rgba(0,0,0,.25)"></div>`
      : `<svg width="26" height="34" viewBox="0 0 26 34" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))"><path d="M2 2 L2 26 L8 20.5 L12.2 30.5 L16.4 28.7 L12.3 19 L20.5 19 Z" fill="#111" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`;
    c.style.transform = `translate(${x - (touch ? 0 : 2)}px, ${y - (touch ? 0 : 2)}px) scale(${s})`;
    c.style.opacity = show;
  };
};

export const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export async function open({ url, out, w, h, mobile = false }) {
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: process.env.PW_CHROME, args: process.env.NOGPU ? [] : ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
  const ctx = await b.newContext(mobile ? { viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await ctx.addInitScript(TIME_HOOK);
  const p = await ctx.newPage();
  p.on("pageerror", (e) => console.log("pageerror", String(e).slice(0, 200)));
  await p.goto(url, { waitUntil: "networkidle" });
  const st = { n: 0, x: w * 0.8, y: h * 0.7, show: 0, scale: 1, touch: mobile, marks: {} };
  const api = {
    p,
    st,
    freeze: () => p.evaluate(() => window.__freeze()),
    async frame() {
      await p.evaluate(([x, y, s, v, t, ms]) => (window.__step(ms), window.__cur(x, y, s, v, t)), [st.x, st.y, st.scale, st.show, st.touch, STEP]);
      await p.screenshot({ path: `${out}/${String(st.n++).padStart(4, "0")}.jpg`, type: "jpeg", quality: 92 });
    },
    async hold(sec) {
      for (let i = 0, k = Math.round(sec * FPS); i < k; i++) await api.frame();
    },
    mark(name) {
      st.marks[name] = st.n;
    },
    // плавная прокрутка до y за sec секунд (scroller — функция, ставящая позицию)
    async scrollTo(to, sec, setY) {
      const from = await p.evaluate(() => scrollY);
      const k = Math.round(sec * FPS);
      for (let i = 1; i <= k; i++) {
        const y = Math.round(from + (to - from) * ease(i / k));
        await p.evaluate(([y, mode]) => {
          if (mode === "lenis" && window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true });
          else window.scrollTo(0, y);
        }, [y, setY || "native"]);
        await api.frame();
      }
    },
    async moveTo(x, y, sec) {
      const fx = st.x, fy = st.y;
      st.show = 1;
      const k = Math.round(sec * FPS);
      for (let i = 1; i <= k; i++) {
        const e = ease(i / k);
        st.x = fx + (x - fx) * e;
        st.y = fy + (y - fy) * e - (st.touch ? 0 : Math.sin(Math.PI * e) * 24);
        if (!st.touch) await p.mouse.move(st.x, st.y);
        await api.frame();
      }
    },
    async center(sel) {
      const l = p.locator(sel).first();
      await l.scrollIntoViewIfNeeded().catch(() => {});
      const bx = await l.boundingBox();
      return [bx.x + bx.width / 2, bx.y + bx.height / 2];
    },
    async click(sel, sec = 0.7) {
      const [x, y] = await api.center(sel);
      await api.moveTo(x, y, sec);
      st.scale = 0.86;
      await api.frame();
      await api.frame();
      if (st.touch) await p.touchscreen.tap(x, y);
      else await p.mouse.click(x, y);
      st.scale = 1;
      await api.frame();
    },
    async top(sel) {
      return p.evaluate((sel) => document.querySelector(sel).getBoundingClientRect().top + scrollY, sel);
    },
    async close() {
      fs.writeFileSync(`${out}/marks.json`, JSON.stringify({ frames: st.n, marks: st.marks }, null, 1));
      await b.close();
      console.log(out, st.n, st.marks);
    },
  };
  return api;
}
