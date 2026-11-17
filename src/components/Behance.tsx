import { behance, me } from "@/content";
import s from "./behance.module.scss";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Работы с Behance — общий блок для всех вариантов; цвета берёт у страницы (currentColor)
export default function Behance({ title = "Ещё работы на Behance", wide }: { title?: string; wide?: boolean }) {
  return (
    <section className={`${s.wrap} ${wide ? s.wide : ""}`}>
      <div className={s.head}>
        <h2>{title}</h2>
        <a href={me.behance} target="_blank" rel="noopener noreferrer">
          Профиль на Behance ↗
        </a>
      </div>
      <ul className={s.grid}>
        {behance.map((b, i) => (
          <li key={b.url} data-reveal style={{ ["--d" as string]: i }}>
            <a href={b.url} target="_blank" rel="noopener noreferrer" className={s.card}>
              <span className={s.img}>
                <img src={`${BASE}/behance/b${i + 1}.jpg`} alt={b.t} loading="lazy" />
              </span>
              <b>{b.t}</b>
              <span className={s.d}>{b.d}</span>
              <span className={s.tags}>
                {b.tags.map((t) => (
                  <i key={t}>{t}</i>
                ))}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
