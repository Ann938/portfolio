"use client";

import { useEffect, useState } from "react";
import { cases, stories, type Case, type CaseStory } from "@/content";
import s from "./case.module.scss";
import Video from "./Video";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const shot = (id: string, f: string) => `${BASE}/cases/${id}/${f}.jpg`;
const VARIANTS: Record<string, string> = { "1": "/", "2": "/v2/", "3": "/v3/" };

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Смена темы: ползунок между двумя экранами или вкладки
function Themes({ id, th }: { id: string; th: NonNullable<CaseStory["themes"]> }) {
  const [x, setX] = useState(50);
  const [tab, setTab] = useState(0);
  return (
    <section className={s.themes}>
      <div className={s.themesHead}>
        <h2 className={s.h2}>{th.t}</h2>
        <p>{th.d}</p>
      </div>
      {th.mode === "slider" ? (
        <div className={s.split} style={{ ["--x" as string]: `${x}%` }}>
          <img src={shot(id, "t2")} alt={th.items[1].label} />
          <img className={s.splitTop} src={shot(id, "t1")} alt={th.items[0].label} />
          <span className={s.splitLine} aria-hidden>
            <i>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M8 6 3 11l5 5M14 6l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </i>
          </span>
          <span className={s.splitLabel} data-side="l">
            {th.items[0].label}
          </span>
          <span className={s.splitLabel} data-side="r">
            {th.items[1].label}
          </span>
          <input type="range" min={0} max={100} value={x} onChange={(e) => setX(+e.target.value)} aria-label="Сравнить темы" />
        </div>
      ) : (
        <div>
          <div className={s.tabs} role="tablist">
            {th.items.map((it, k) => (
              <button key={it.label} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} style={{ ["--t" as string]: it.color }}>
                <i />
                {it.label}
              </button>
            ))}
          </div>
          <div className={s.tabShots}>
            {th.items.map((it, k) => (
              <img key={it.label} src={shot(id, `t${k + 1}`)} alt={it.label} data-on={tab === k ? "" : undefined} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// Другие страницы сайта: экран на компьютере и телефоне
function Pages({ id, pages }: { id: string; pages: NonNullable<CaseStory["pages"]> }) {
  return (
    <section className={s.pages}>
      <h2 className={s.h2}>Другие страницы</h2>
      <ul className={s.pageGrid} data-n={pages.length}>
        {pages.map((pg, k) => (
          <li key={pg.t} data-reveal style={{ ["--d" as string]: k }}>
            <div className={s.pageShots}>
              <img className={s.pageDesk} src={shot(id, `p${k + 1}`)} alt={pg.t} loading="lazy" />
              <img className={s.pagePhone} src={shot(id, `pm${k + 1}`)} alt={`${pg.t} на телефоне`} loading="lazy" />
            </div>
            <h3>{pg.t}</h3>
            <p>{pg.d}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Страница кейса: о проекте, фишки с экранами, мобильная версия, следующий кейс.
// ?v=1|2|3 — из какого варианта главной пришли (туда ведёт «Все работы»)
export default function CaseView({ c }: { c: Case }) {
  const st = stories[c.id];
  const [v, setV] = useState("1");
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("v");
    if (q && VARIANTS[q]) setV(q);
  }, []);
  const i = cases.findIndex((x) => x.id === c.id);
  const next = cases[(i + 1) % cases.length];

  return (
    <div className={s.page} style={{ ["--c" as string]: c.color }}>
      <section className={s.hero}>
        <header className={s.top}>
          <a href={`${BASE}${VARIANTS[v]}#work`}>← Все работы</a>
          <span>
            Кейс {String(i + 1).padStart(2, "0")} / {String(cases.length).padStart(2, "0")}
          </span>
        </header>
        <div className={s.heroIn}>
          <div className={s.heroText}>
            <p className={s.kind}>
              {c.kind} · {c.year}
            </p>
            <h1>{c.title}</h1>
            <p className={s.lead}>{c.text}</p>
            <ul className={s.tags}>
              {c.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <a href={c.url} target="_blank" rel="noopener noreferrer" className={s.live}>
              Открыть живой сайт <Arrow />
            </a>
          </div>
          <div className={s.devices}>
            <Video className={s.desk} src={`${BASE}/cases/${c.id}/v-d.mp4`} poster={`${BASE}/cases/${c.id}.jpg`} label={`${c.title}: сайт в движении`} />
            <Video className={s.phone} src={`${BASE}/cases/${c.id}/v-m.mp4`} poster={`${BASE}/cases/${c.id}-m.jpg`} label={`${c.title}: на телефоне`} />
          </div>
        </div>
      </section>

      <section className={s.facts}>
        <div>
          <span>Задача</span>
          <p>{st.task}</p>
        </div>
        <div>
          <span>Что я делала</span>
          <p>{st.role}</p>
        </div>
        <div>
          <span>Результат</span>
          <p>{st.result}</p>
        </div>
      </section>

      <section className={s.features}>
        <h2 className={s.h2}>Что внутри</h2>
        {st.features.map((f, k) => (
          <article key={f.t} className={s.feature} data-reveal>
            <figure className={s.screen}>
              <img src={shot(c.id, `f${k + 1}`)} alt={f.t} loading="lazy" />
            </figure>
            <div className={s.fText}>
              <b>{String(k + 1).padStart(2, "0")}</b>
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </div>
          </article>
        ))}
      </section>

      {st.themes && <Themes id={c.id} th={st.themes} />}
      {st.pages && <Pages id={c.id} pages={st.pages} />}

      <section className={s.mobile}>
        <div className={s.mobileText}>
          <h2 className={s.h2}>На телефоне</h2>
          <p>{st.mobile}</p>
        </div>
        <ul className={s.phones}>
          {[1, 2, 3].map((n) => (
            <li key={n} data-reveal style={{ ["--d" as string]: n - 1 }}>
              <img src={shot(c.id, `m${n}`)} alt={`${c.title}: экран ${n} на телефоне`} loading="lazy" />
            </li>
          ))}
        </ul>
      </section>

      <a href={`${BASE}/work/${next.id}/?v=${v}`} className={s.next} style={{ ["--n" as string]: next.color }}>
        <span>Следующий кейс</span>
        <b>
          {next.title} <Arrow />
        </b>
        <small>{next.kind}</small>
      </a>
    </div>
  );
}
