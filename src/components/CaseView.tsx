"use client";

import { useEffect, useState } from "react";
import { cases, stories, type Case } from "@/content";
import s from "./case.module.scss";

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
            <img className={s.desk} src={`${BASE}/cases/${c.id}.jpg`} alt={`${c.title}: первый экран`} />
            <img className={s.phone} src={`${BASE}/cases/${c.id}-m.jpg`} alt={`${c.title}: первый экран на телефоне`} />
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
