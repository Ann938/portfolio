"use client";

import { useEffect, useRef } from "react";

// Беззвучный ролик по кругу: грузится и играет, только пока виден на экране
export default function Video({ src, poster, className, label }: { src: string; poster: string; className?: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.preload !== "auto") v.preload = "auto";
          v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} className={className} src={src} poster={poster} muted loop playsInline preload="none" aria-label={label} />;
}
