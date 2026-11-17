import type { Metadata } from "next";
import { Inter_Tight, Manrope, Playfair_Display, Unbounded } from "next/font/google";
import "@/styles/globals.scss";

// Шрифты трёх вариантов: 1 — Playfair + Manrope, 2 — Unbounded + Manrope, 3 — Inter Tight
const playfair = Playfair_Display({ variable: "--f-serif", subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], style: ["normal", "italic"] });
const manrope = Manrope({ variable: "--f-sans", subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"] });
const unbounded = Unbounded({ variable: "--f-wide", subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"] });
const tight = Inter_Tight({ variable: "--f-tight", subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700", "800"] });

const title = "Anyart — Аня, UX/UI-дизайнер";
const description = "Портфолио UX/UI-дизайнера: сайты, интерфейсы сервисов, дизайн-системы и блог о дизайне.";

export const metadata: Metadata = {
  robots: process.env.PAGES_EXPORT === "1" ? { index: false, follow: false } : undefined,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3700"),
  title,
  description,
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/favicon.svg` },
  openGraph: { title, description, type: "website", locale: "ru_RU" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${playfair.variable} ${manrope.variable} ${unbounded.variable} ${tight.variable}`}>
      <body>{children}</body>
    </html>
  );
}
