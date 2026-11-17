import { cases, me, posts } from "@/content";
import s from "./v2.module.scss";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const img = (id: string, m = false) => `${BASE}/cases/${id}${m ? "-m" : ""}.jpg`;

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Окно браузера вокруг скриншота кейса
function Browser({ id, url }: { id: string; url: string }) {
  return (
    <span className={s.browser}>
      <span className={s.bar}>
        <i />
        <i />
        <i />
        <span>{url.replace("https://", "")}</span>
      </span>
      <img src={img(id)} alt="" loading="lazy" />
    </span>
  );
}

// Вариант 2 «Бенто»: тёмный, плитки разного размера, акцент — лайм
export default function V2() {
  const [first, ...rest] = cases;
  return (
    <div className={s.page}>
      <header className={s.header}>
        <a href={`${BASE}/v2/`} className={s.logo}>
          <b>А</b> {me.name}
        </a>
        <nav className={s.nav}>
          <a href="#work">Работы</a>
          <a href="#blog">Блог</a>
          <a href="#contact">Контакты</a>
        </nav>
      </header>

      <main>
        <section className={s.hero}>
          <div className={`${s.cell} ${s.title}`} data-reveal>
            <p className={s.tag}>
              <i /> {me.role}
            </p>
            <h1>
              Сайты, которые <mark>запоминают</mark> с первого экрана
            </h1>
          </div>
          <div className={`${s.cell} ${s.lead}`} data-reveal style={{ ["--d" as string]: 1 }}>
            <p>{me.lead}</p>
            <a href="#work" className={s.btn}>
              Смотреть работы <Arrow />
            </a>
          </div>
          <a href={first.url} target="_blank" rel="noopener noreferrer" className={`${s.cell} ${s.shot}`} data-reveal style={{ ["--d" as string]: 2 }}>
            <img src={img(first.id)} alt="" />
            <span className={s.shotLabel}>
              Свежий кейс · <b>{first.title}</b> <Arrow />
            </span>
          </a>
          {me.stats.map((st, i) => (
            <div key={st.t} className={`${s.cell} ${s.stat}`} data-reveal style={{ ["--d" as string]: 3 + i }}>
              <b>{st.v}</b>
              <span>{st.t}</span>
            </div>
          ))}
          <div className={`${s.cell} ${s.marquee}`} aria-hidden>
            <div>
              {[0, 1].map((k) => (
                <span key={k}>
                  {me.services.map((sv) => (
                    <em key={sv.t}>
                      {sv.t}{" "}
                      <svg className={s.star} viewBox="0 0 24 24" aria-hidden>
                        <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                      </svg>
                    </em>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className={s.work}>
          <div className={s.secHead}>
            <h2>Работы</h2>
            <p>Каждый кейс открывается живым сайтом — можно полистать и потрогать.</p>
          </div>
          <ul className={s.bento}>
            {[first, ...rest].map((c, i) => (
              <li key={c.id} className={s[`b${i}`]} data-reveal style={{ ["--d" as string]: i % 3, ["--c" as string]: c.color }}>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className={s.case}>
                  <Browser id={c.id} url={c.url} />
                  <span className={s.caseInfo}>
                    <span>
                      <b>{c.title}</b>
                      <small>{c.kind}</small>
                    </span>
                    <span className={s.go}>
                      <Arrow />
                    </span>
                  </span>
                  <span className={s.caseText}>{c.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="blog" className={s.blog}>
          <div className={s.secHead}>
            <h2>Блог</h2>
            <a href={`${BASE}/blog/`} className={s.more}>
              Все статьи <Arrow />
            </a>
          </div>
          <ul className={s.posts}>
            {posts.slice(0, 3).map((p, i) => (
              <li key={p.id} data-reveal style={{ ["--d" as string]: i }}>
                <a href={`${BASE}/blog/${p.id}/`} className={s.post}>
                  <span className={s.pill}>{p.tag}</span>
                  <b>{p.title}</b>
                  <span className={s.postLead}>{p.lead}</span>
                  <span className={s.postMeta}>
                    {p.date} · {p.min} мин <Arrow />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className={s.contact}>
          <div className={s.contactBox} data-reveal>
            <p>Есть задача?</p>
            <h2>Расскажите о проекте — предложу решение за день</h2>
            <a href={me.insta} target="_blank" rel="noopener noreferrer" className={s.btnDark}>
              Написать в Instagram {me.handle} <Arrow />
            </a>
          </div>
        </section>
      </main>
      <footer className={s.footer}>
        <span>© 2026 {me.name}</span>
        <span>{me.role}</span>
      </footer>
    </div>
  );
}
