import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cases } from "@/content";
import CaseView from "@/components/CaseView";
import Smooth from "@/components/Smooth";

export function generateStaticParams() {
  return cases.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = cases.find((x) => x.id === id);
  return c ? { title: `${c.title} — кейс · Аня`, description: c.text.replace(/\u00a0/g, " ") } : {};
}

// адрес читаем внутри Suspense — так страница работает и в разработке (cacheComponents), и в статической сборке
async function Work({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = cases.find((x) => x.id === id);
  if (!c) notFound();
  return <CaseView c={c} />;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <Smooth />
      <Suspense fallback={null}>
        <Work params={params} />
      </Suspense>
    </>
  );
}
