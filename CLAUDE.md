@AGENTS.md

# Портфолио Ани (веб-дизайнер) — три варианта на выбор

- Next 16 + SCSS-модули, `u()` в `src/styles/_core.scss` (ДВ 1440 / контент 1312; МВ ≤1023 — колонка 358). Dev: `npx next dev -p 3700`.
- Тексты, кейсы и статьи блога — `src/content.ts` (имя и описание черновые — уточнить у пользователя). Кейсы ссылаются на опубликованные сайты ann938.github.io/*.
- Обложки кейсов — снимки живых сайтов: `node scripts/shot-cases.mjs` → `public/cases/<id>.jpg` и `-m.jpg` (нужен PW_CHROME).
- Варианты: `/` — V1 «Редакция» (светлый, Playfair, список кейсов с превью у курсора), `/v2` — V2 «Бенто» (тёмный, Unbounded, лайм),
  `/v3` — V3 «Сцена» (синий, Inter Tight, кейсы едут по горизонтали — GSAP pin, только ДВ). `Switcher.tsx` — переключатель вариантов (убрать после выбора).
- Кейсы открываются страницей `/work/<id>/?v=N` (`CaseView.tsx`, `case.module.scss`, тексты — `stories` в content.ts): цветной первый экран,
  задача/роль/результат, 4 фишки с экранами (`public/cases/<id>/f1…f4.jpg`), мобильные экраны (m1…m3), следующий кейс. `?v` — куда ведёт «Все работы».
  Экраны сняты `scripts/shot-screens.mjs` (в research/screens), отобраны вручную. Живой сайт — только кнопкой «Открыть живой сайт».
- Блог: `/blog`, `/blog/<id>` (`BlogViews.tsx`, палитра V1).
- Проверка: `node scripts/shot.mjs <path> <out> [w h]` (в Git Bash — `MSYS_NO_PATHCONV=1`).
- Публикация (опубликовано 17.11 с её согласия, репо Ann938/portfolio): `npm run deploy` → ann938.github.io/portfolio.
