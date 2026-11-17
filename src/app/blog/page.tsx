import type { Metadata } from "next";
import { BlogIndex } from "@/components/BlogViews";

export const metadata: Metadata = { title: "Блог о дизайне — Аня" };

export default function Page() {
  return <BlogIndex />;
}
