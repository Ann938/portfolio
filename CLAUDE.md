@AGENTS.md

# Anyart — портфолио Ани (UX/UI-дизайнер) — три варианта на выбор

Название Anyart выбрала она (17.11; брендов с таким именем не нашли, anyart.ru продаётся перекупщиком). Behance: behance.net/6fce9172.

- Next 16 + SCSS-модули, `u()` в `src/styles/_core.scss` (ДВ 1440 / контент 1312; МВ ≤1023 — колонка 358). Dev: `npx next dev -p 3700`.
- Тексты, кейсы и статьи блога — `src/content.ts` (имя и описание черновые — уточнить у пользователя). Кейсы ссылаются на опубликованные сайты ann938.github.io/*.
- Обложки кейсов — снимки живых сайтов: `node scripts/shot-cases.mjs` → `public/cases/<id>.jpg` и `-m.jpg` (нужен PW_CHROME).
- Варианты: `/` — V1 «Редакция» (светлый, Playfair, список кейсов с превью у курсора), `/v2` — V2 «Бенто» (тёмный, Unbounded, лайм),
  `/v3` — V3 «Сцена» (синий, Inter Tight, кейсы едут по горизонтали — GSAP pin, только ДВ). `Switcher.tsx` — переключатель вариантов (убрать после выбора).
- Кейсы открываются страницей `/work/<id>/?v=N` (`CaseView.tsx`, `case.module.scss`, тексты — `stories` в content.ts): цветной первый экран,
  задача/роль/результат, 4 фишки с экранами (`public/cases/<id>/f1…f4.jpg`), мобильные экраны (m1…m3), следующий кейс. `?v` — куда ведёт «Все работы».
  Экраны сняты `scripts/shot-screens3.mjs` (ДВ в двойной плотности, сохраняются 2000 px; мобильные — из screens2) (частые кадры в research/screens2, отобраны вручную — без пустых половин). Секции «смена темы» (slider: t1/t2, tabs: t1…tN)
  и «Другие страницы» (p*/pm*) — поля `themes`/`pages` в stories. Живой сайт — только кнопкой «Открыть живой сайт».
- Видео с сайтов — покадровая съёмка с управляемым временем (плавно, 30 fps): `node scripts/cap-site.mjs <id> dv|mv [native|lenis]`
  (`lib-cap.mjs` — из ~/projects/portfolio-reels; `NOGPU=1` без GPU) → research/frames, затем `python -I scripts/encode-video.py <ffmpeg>` →
  `public/cases/<id>/v-d.mp4` (1440), `v-m.mp4` (520) + постер. Добро в замороженном времени ломается (герой «застревает»),
  поэтому его ролик — плавная прокрутка полного скриншота страницы (кадры собраны в Python). Запись Playwright recordVideo — дёргалась, не использовать. `Video.tsx` грузит и играет ролик только в зоне видимости. Видео — в первом экране кейса, в плитках V2 и на панелях V3.
- Работы с Behance — `behance` в content.ts, обложки `public/behance/b1…b4.jpg`, блок `Behance.tsx` во всех вариантах (ссылки на Behance).
- Блог: `/blog`, `/blog/<id>` (`BlogViews.tsx`, палитра V1).
- Проверка: `node scripts/shot.mjs <path> <out> [w h]` (в Git Bash — `MSYS_NO_PATHCONV=1`).
- Публикация (опубликовано 17.11 с её согласия, репо Ann938/portfolio): `npm run deploy` → ann938.github.io/portfolio.
