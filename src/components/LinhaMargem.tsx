import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// A linha vermelha da margem do caderno, presa na tela durante o site todo.
// O trecho já lido fica com a tinta cheia, como se a caneta descesse junto.
export function LinhaMargem() {
  const tinta = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        tinta.current,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.4 } },
      );
    });
  });

  return (
    <span className="pointer-events-none fixed inset-y-0 left-[var(--margem)] z-40 w-px bg-caneta/30" aria-hidden>
      <span ref={tinta} className="absolute inset-0 origin-top bg-caneta" />
    </span>
  );
}
