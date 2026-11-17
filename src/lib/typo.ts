// Типографика: короткие слова (предлоги, союзы, частицы) не остаются висеть в конце строки —
// после них ставится неразрывный пробел; тире не переносится на новую строку.
const NBSP = " ";
const SHORT = /(^|[\s(«"„])([а-яёА-ЯЁ]{1,3}|без|для|под|над|при|про|из-за|через|чтобы)\s+(?=\S)/g;

export function nb(s: string): string {
  // дважды — для цепочек вроде «и в», «а на»
  return s.replace(SHORT, `$1$2${NBSP}`).replace(SHORT, `$1$2${NBSP}`).replace(/\s+—/g, `${NBSP}—`);
}

// Пройти по объекту контента и обработать все строки (кроме служебных полей)
const SKIP = new Set(["id", "photo", "pos", "kind", "sex", "href"]);
export function nbDeep<T>(o: T): T {
  if (typeof o === "string") return nb(o) as T;
  if (Array.isArray(o)) {
    o.forEach((v, i) => (o[i] = nbDeep(v)));
    return o;
  }
  if (o && typeof o === "object") {
    for (const k of Object.keys(o) as (keyof T)[]) {
      if (!SKIP.has(String(k))) o[k] = nbDeep(o[k]);
    }
  }
  return o;
}
