// Gera os clipes e as fotos otimizadas usados pelo site.
// Originais em assets/videos e assets/fotos. Rode com: npm run media
import { spawnSync } from "node:child_process";
import { mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import ffmpeg from "ffmpeg-static";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const videosIn = path.join(root, "assets", "videos");
const fotosIn = path.join(root, "assets", "fotos");
const mediaOut = path.join(root, "public", "media");
const fotosOut = path.join(root, "public", "fotos");
mkdirSync(mediaOut, { recursive: true });
mkdirSync(fotosOut, { recursive: true });

// Os vídeos de celular chegam com rotação nos metadados, então o recorte é
// calculado sobre a imagem já girada: proporção alvo centralizada, com "y"
// (0 a 1) para descer ou subir o enquadramento.
const clips = [
  // Vídeo de apresentação gravado pelo Gustavo (já vem em 9:16 e com legenda).
  { name: "apresentacao", src: "apresentacao", start: 0, dur: 22, ratio: 9 / 16, width: 576, crf: 23, audio: true },
  { name: "cta", src: "w08", start: 2, dur: 6, ratio: 16 / 9, width: 960, crf: 30 },
];

function run(args) {
  const r = spawnSync(ffmpeg, ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`ffmpeg falhou: ${args.join(" ")}`);
}

for (const c of clips) {
  const src = path.join(videosIn, `${c.src}.mp4`);
  const r = c.ratio ?? 4 / 5;
  const y = c.y ?? 0.5;
  const crop = `crop='min(iw,ih*${r})':'min(ih,iw/${r})':'(iw-ow)/2':'(ih-oh)*${y}'`;
  const vf = `${crop},scale=${c.width ?? 540}:-2`;
  const audio = c.audio ? ["-c:a", "aac", "-b:a", "96k"] : ["-an"];
  run(["-ss", String(c.start), "-t", String(c.dur), "-i", src, "-vf", vf, ...audio,
    "-c:v", "libx264", "-preset", "slow", "-crf", String(c.crf ?? 27), "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", path.join(mediaOut, `${c.name}.mp4`)]);
  run(["-ss", String(c.start + 0.2), "-i", src, "-frames:v", "1", "-vf", vf,
    "-q:v", "4", path.join(mediaOut, `${c.name}.jpg`)]);
  console.log("clipe", c.name);
}

for (const f of readdirSync(fotosIn).filter((f) => f.endsWith(".jpg"))) {
  await sharp(path.join(fotosIn, f))
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(path.join(fotosOut, f.replace(/\.jpg$/, ".webp")));
}
console.log("fotos prontas");
