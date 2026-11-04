import { useEffect, useRef, useState } from "react";

type Props = {
  name: string;
  className?: string;
  /** Sem label, o vídeo é tratado como decorativo. */
  label?: string;
};

// Clipe curto em loop. Vídeo e capa só são pedidos quando o clipe está a
// ~1 tela de aparecer (antes disso nada é baixado), e ele só toca enquanto
// está na tela. Com "reduzir movimento" ativo, fica parado na capa.
export function LoopVideo({ name, className, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [perto, setPerto] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const chegando = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPerto(true);
          chegando.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    chegando.observe(video);
    return () => chegando.disconnect();
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || !perto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const naTela = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 },
    );
    naTela.observe(video);
    return () => naTela.disconnect();
  }, [perto]);

  return (
    <video
      ref={ref}
      className={className}
      src={perto ? `/media/${name}.mp4` : undefined}
      poster={perto ? `/media/${name}.jpg` : undefined}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
