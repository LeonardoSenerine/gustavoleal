import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Animações que valem pra página toda. Fica por último no App para que
// os pins das seções já existam quando estes gatilhos forem calculados.
export function Movimento() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Textos e blocos marcados com data-revela sobem suavemente ao entrar.
      gsap.set("[data-revela]", { y: 36, opacity: 0 });
      ScrollTrigger.batch("[data-revela]", {
        start: "top 88%",
        once: true,
        onEnter: (lote) => gsap.to(lote, { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.08, overwrite: true }),
      });

      // Header some ao descer e volta ao subir.
      const header = document.querySelector<HTMLElement>("[data-header]");
      if (header) {
        const mostrar = gsap.quickTo(header, "yPercent", { duration: 0.5, ease: "power3.out" });
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => mostrar(self.direction === 1 && self.scroll() > 240 ? -140 : 0),
        });
      }

      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });

    // Botões puxam levemente o ponteiro, como um ímã.
    mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
      const limpar = gsap.utils.toArray<HTMLElement>(".botao").map((botao) => {
        const x = gsap.quickTo(botao, "x", { duration: 0.5, ease: "power3.out" });
        const y = gsap.quickTo(botao, "y", { duration: 0.5, ease: "power3.out" });
        const mover = (e: PointerEvent) => {
          const r = botao.getBoundingClientRect();
          x((e.clientX - r.left - r.width / 2) * 0.25);
          y((e.clientY - r.top - r.height / 2) * 0.35);
        };
        const sair = () => {
          x(0);
          y(0);
        };
        botao.addEventListener("pointermove", mover);
        botao.addEventListener("pointerleave", sair);
        return () => {
          botao.removeEventListener("pointermove", mover);
          botao.removeEventListener("pointerleave", sair);
        };
      });
      return () => limpar.forEach((fn) => fn());
    });
  });

  return null;
}
