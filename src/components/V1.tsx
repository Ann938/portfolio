"use client";

import { useEffect, useRef, useState } from "react";
import { cases, me, posts } from "@/content";
import s from "./v1.module.scss";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const img = (id: string, m = false) => `${BASE}/cases/${id}${m ? "-m" : ""}.jpg`;

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Вариант 1 «Редакция»: светлый, крупная антиква, кейсы — список с превью у курсора
export default function V1() {
  const [hover, setHover] = useState<string | null>(null);
  const prev = useRef<HTMLDivElement>(null);

  // превью кейса едет за курсором с запаздыванием (только ДВ)
  useEffect(() => {
    const el = prev.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className={s.page}>
      <header className={s.header}>
        <a href={`${BASE}/`} className={s.logo}>
          {me.name}<span>.</span>
        </a>
        <nav className={s.nav}>
          <a href="#work">Кейсы</a>
          <a href="#blog">Блог</a>
          <a href="#about">Обо мне</a>
        </nav>
        <a href={me.insta} target="_blank" rel="noopener noreferrer" className={s.headCta}>
          Написать
        </a>
      </header>

      <main>
        <section className={s.hero}>
          <p className={s.status} data-reveal>
            <i /> Открыта к новым проектам
          </p>
          <h1 className={s.h1} data-reveal style={{ ["--d" as string]: 1 }}>
            Делаю сайты, которые <em>запоминают</em> с&nbsp;первого экрана
          </h1>
          <div className={s.heroFoot} data-reveal style={{ ["--d" as string]: 2 }}>
            <p className={s.role}>
              {me.name} · {me.role}
            </p>
            <p className={s.lead}>{me.lead}</p>
            <a href="#work" className={s.btn}>
              Смотреть кейсы
            </a>
          </div>
        </section>

        <section id="work" className={s.work}>
          <div className={s.secHead}>
            <h2 className={s.h2}>Избранные работы</h2>
            <span className={s.count}>{String(cases.length).padStart(2, "0")}</span>
          </div>
          <ul className={s.list} onPointerLeave={() => setHover(null)}>
            {cases.map((c, i) => (
              <li key={c.id} data-reveal>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className={s.row} onPointerEnter={() => setHover(c.id)} data-dim={hover && hover !== c.id ? "" : undefined}>
                  <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={s.rowTitle}>{c.title}</span>
                  <span className={s.rowKind}>
                    {c.kind}
                    <small>{c.short}</small>
                  </span>
                  <span className={s.rowTags}>
                    {c.tags.map((t) => (
                      <b key={t}>{t}</b>
                    ))}
                  </span>
                  <span className={s.rowYear}>
                    {c.year} <Arrow />
                  </span>
                  <img className={s.rowImg} src={img(c.id)} alt="" loading="lazy" />
                </a>
              </li>
            ))}
          </ul>
          <div className={s.preview} ref={prev} aria-hidden>
            {cases.map((c) => (
              <img key={c.id} src={img(c.id)} alt="" data-on={hover === c.id ? "" : undefined} />
            ))}
          </div>
        </section>

        <section id="about" className={s.about}>
          <p className={s.kicker}>Обо мне</p>
          <p className={s.aboutText} data-reveal>
            {me.about}
          </p>
          <ul className={s.services}>
            {me.services.map((sv, i) => (
              <li key={sv.t} data-reveal style={{ ["--d" as string]: i }}>
                <span>0{i + 1}</span>
                <h3>{sv.t}</h3>
                <p>{sv.d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="blog" className={s.blog}>
          <div className={s.secHead}>
            <h2 className={s.h2}>
              Пишу о <em>дизайне</em>
            </h2>
            <a href={`${BASE}/blog/`} className={s.more}>
              Все статьи <Arrow />
            </a>
          </div>
          <ul className={s.posts}>
            {posts.slice(0, 4).map((p) => (
              <li key={p.id} data-reveal>
                <a href={`${BASE}/blog/${p.id}/`} className={s.post}>
                  <span className={s.postDate}>{p.date}</span>
                  <span className={s.postTitle}>{p.title}</span>
                  <span className={s.postTag}>
                    {p.tag} · {p.min} мин
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className={s.contact}>
          <p className={s.kicker}>Контакты</p>
          <a href={me.insta} target="_blank" rel="noopener noreferrer" className={s.big}>
            Давайте сделаем <em>ваш</em> сайт <Arrow />
          </a>
          <p className={s.contactNote}>
            Пишите в Instagram <b>{me.handle}</b> — отвечу в течение дня
          </p>
        </section>
      </main>
      <footer className={s.footer}>
        <span>© 2026 {me.name}</span>
        <a href={me.insta} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </footer>
    </div>
  );
}
