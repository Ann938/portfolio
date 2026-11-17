"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cases, me, posts } from "@/content";
import s from "./v3.module.scss";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const img = (id: string, m = false) => `${BASE}/cases/${id}${m ? "-m" : ""}.jpg`;
const WORDS = ["запоминают", "продают", "удивляют", "работают"];

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Вариант 3 «Сцена»: синий первый экран с огромным именем, кейсы едут по горизонтали при скролле
export default function V3() {
  const [w, setW] = useState(0);
  const pin = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  // слово в заголовке меняется каждые 2,2 с
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setW((x) => (x + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);

  // горизонтальная лента кейсов: секция закрепляется, вертикальный скролл двигает ленту (только ДВ)
  useEffect(() => {
    const root = pin.current, tr = track.current;
    if (!root || !tr) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const dist = () => tr.scrollWidth - window.innerWidth;
        gsap.to(tr, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div className={s.page}>
      <section className={s.hero}>
        <header className={s.header}>
          <span>{me.role}</span>
          <nav>
            <a href="#work">Кейсы</a>
            <a href="#blog">Блог</a>
            <a href="#contact">Контакты</a>
          </nav>
          <a href={me.insta} target="_blank" rel="noopener noreferrer">
            {me.handle}
          </a>
        </header>
        <div className={s.heroMid}>
          <p className={s.claim}>
            Делаю сайты,
            <br />
            которые{" "}
            <span className={s.word} key={w}>
              {WORDS[w]}
            </span>
          </p>
          <p className={s.lead}>{me.lead}</p>
        </div>
        <h1 className={s.name}>{me.name.toUpperCase()}</h1>
        {/* веер из трёх работ справа от имени */}
        <a href="#work" className={s.stack} aria-label="Смотреть кейсы">
          {cases.slice(0, 3).map((c) => (
            <img key={c.id} src={img(c.id)} alt="" />
          ))}
        </a>
      </section>

      <section id="work" className={s.work} ref={pin}>
        <div className={s.workHead}>
          <h2>Кейсы</h2>
          <span>
            {cases.length} проектов<em> · листайте вниз →</em>
          </span>
        </div>
        <div className={s.track} ref={track}>
          {cases.map((c, i) => (
            <article key={c.id} className={s.panel} style={{ ["--c" as string]: c.color }}>
              <div className={s.panelText}>
                <span className={s.idx}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{c.title}</h3>
                <p className={s.kind}>
                  {c.kind} · {c.year}
                </p>
                <p className={s.text}>{c.text}</p>
                <ul className={s.tags}>
                  {c.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className={s.open}>
                  Открыть сайт <Arrow />
                </a>
              </div>
              <div className={s.devices}>
                <img className={s.desk} src={img(c.id)} alt={`${c.title} — сайт на компьютере`} loading="lazy" />
                <img className={s.phone} src={img(c.id, true)} alt={`${c.title} — сайт на телефоне`} loading="lazy" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="blog" className={s.blog}>
        <div className={s.blogHead}>
          <h2>Заметки о дизайне</h2>
          <a href={`${BASE}/blog/`}>
            Все статьи <Arrow />
          </a>
        </div>
        <ul>
          {posts.map((p, i) => (
            <li key={p.id} data-reveal>
              <a href={`${BASE}/blog/${p.id}/`} className={s.post}>
                <span className={s.pNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.pTitle}>{p.title}</span>
                <span className={s.pTag}>{p.tag}</span>
                <span className={s.pGo}>
                  <Arrow />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" className={s.contact}>
        <div className={s.run} aria-hidden>
          <div>
            {Array.from({ length: 6 }, (_, k) => (
              <span key={k}>
                Напишите мне <i />
              </span>
            ))}
          </div>
        </div>
        <div className={s.contactIn}>
          <p>{me.about}</p>
          <a href={me.insta} target="_blank" rel="noopener noreferrer" className={s.cta}>
            Instagram {me.handle} <Arrow />
          </a>
        </div>
        <footer className={s.footer}>
          <span>© 2026 {me.name}</span>
          <span>{me.role}</span>
        </footer>
      </section>
    </div>
  );
}
