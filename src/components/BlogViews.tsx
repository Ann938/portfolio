import { me, posts, type Post } from "@/content";
import s from "./blog.module.scss";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

function Top({ back }: { back: { href: string; t: string } }) {
  return (
    <header className={s.header}>
      <a href={`${BASE}/`} className={s.logo}>
        {me.name}
        <span>.</span>
      </a>
      <a href={`${BASE}${back.href}`} className={s.back}>
        ← {back.t}
      </a>
    </header>
  );
}

// Список статей
export function BlogIndex() {
  return (
    <div className={s.page}>
      <Top back={{ href: "/", t: "На главную" }} />
      <main className={s.main}>
        <h1 className={s.h1}>
          Блог о <em>дизайне</em>
        </h1>
        <p className={s.lead}>UX, интерфейсы, анимация и то, как я работаю над сайтами.</p>
        <ul className={s.list}>
          {posts.map((p) => (
            <li key={p.id}>
              <a href={`${BASE}/blog/${p.id}/`} className={s.row}>
                <span className={s.date}>{p.date}</span>
                <span className={s.rowBody}>
                  <b>{p.title}</b>
                  <span>{p.lead}</span>
                </span>
                <span className={s.tag}>
                  {p.tag} · {p.min} мин
                </span>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

// Одна статья
export function PostPage({ p }: { p: Post }) {
  const i = posts.findIndex((x) => x.id === p.id);
  const next = posts[(i + 1) % posts.length];
  return (
    <div className={s.page}>
      <Top back={{ href: "/blog/", t: "Все статьи" }} />
      <main className={s.main}>
        <article className={s.article}>
          <p className={s.meta}>
            <b>{p.tag}</b> {p.date} · {p.min} мин чтения
          </p>
          <h1 className={s.h1}>{p.title}</h1>
          <p className={s.lead}>{p.lead}</p>
          <div className={s.body}>
            {p.body.map((b, k) => (
              <section key={k}>
                {b.h && <h2>{b.h}</h2>}
                {b.p.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </section>
            ))}
          </div>
        </article>
        <a href={`${BASE}/blog/${next.id}/`} className={s.next}>
          <span>Следующая статья</span>
          <b>{next.title}</b>
        </a>
        <a href={me.insta} target="_blank" rel="noopener noreferrer" className={s.ask}>
          Нужен сайт? Пишите в Instagram {me.handle}
        </a>
      </main>
    </div>
  );
}
