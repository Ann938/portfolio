import s from "./switcher.module.scss";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const items = [
  { n: 1, href: "/", t: "Редакция" },
  { n: 2, href: "/v2/", t: "Бенто" },
  { n: 3, href: "/v3/", t: "Сцена" },
];

// Переключатель вариантов — только для выбора, в финальный сайт не попадёт
export default function Switcher({ cur }: { cur: number }) {
  return (
    <nav className={s.sw} aria-label="Варианты дизайна">
      <span>Вариант</span>
      {items.map((it) => (
        <a key={it.n} href={`${BASE}${it.href}`} aria-current={cur === it.n ? "page" : undefined} title={it.t}>
          {it.n}
          <i>{it.t}</i>
        </a>
      ))}
    </nav>
  );
}
