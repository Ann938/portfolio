// Раньше здесь был беззвучный ролик по кругу. На телефонах при подгрузке видео страница дёргалась,
// поэтому показываем статичный кадр (постер). Ролики лежат в public/cases/<id>/v-*.mp4, если захотим вернуть.
export default function Video({ poster, className, label }: { src: string; poster: string; className?: string; label?: string }) {
  return <img className={className} src={poster} alt={label ?? ""} loading="lazy" />;
}
