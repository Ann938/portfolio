import type { Metadata } from "next";
import { BlogIndex } from "@/components/BlogViews";

export const metadata: Metadata = { title: "Блог о дизайне — Anyart" };

export default function Page() {
  return <BlogIndex />;
}
