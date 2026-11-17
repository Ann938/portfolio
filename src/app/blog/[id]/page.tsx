import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "@/content";
import { PostPage } from "@/components/BlogViews";

export function generateStaticParams() {
  return posts.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = posts.find((x) => x.id === id);
  return p ? { title: `${p.title} — Anyart`, description: p.lead.replace(/\u00a0/g, " ") } : {};
}

// адрес читаем внутри Suspense — так страница работает и в разработке (cacheComponents), и в статической сборке
async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = posts.find((x) => x.id === id);
  if (!p) notFound();
  return <PostPage p={p} />;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <Post params={params} />
    </Suspense>
  );
}
