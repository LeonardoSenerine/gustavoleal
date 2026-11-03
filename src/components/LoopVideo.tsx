import { useEffect, useRef } from "react";

type Props = {
  name: string;
  className?: string;
  /** Sem label, o vídeo é tratado como decorativo. */
  label?: string;
};

// Clipe curto em loop que só toca enquanto está na tela.
// Com "reduzir movimento" ativo, fica parado no primeiro quadro.
export function LoopVideo({ name, className, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={`/media/${name}.mp4`}
      poster={`/media/${name}.jpg`}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
