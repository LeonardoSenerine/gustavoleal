// Gera a capa de compartilhamento (og.jpg) e os ícones do site.
// O texto vira contorno vetorial direto da Archivo do site, então a capa
// tem a mesma tipografia sem depender de fonte instalada. Rode com: npm run marca
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as fontkit from "fontkit";
import sharp from "sharp";
import wawoff2 from "wawoff2";

const root = path.resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);
const arquivoFonte = require.resolve("@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2");
// O fontkit só aplica os eixos variáveis (largura e peso) em TTF, então o
// WOFF2 do site é descompactado antes.
const base = fontkit.create(Buffer.from(await wawoff2.decompress(readFileSync(arquivoFonte))));

const cor = {
  vinho: "#6b1020",
  vinhoEscuro: "#3d0912",
  vinhoClaro: "#8e1c31",
  preto: "#0d0b0a",
  off: "#f1ebdf",
  vermelho: "#d7263d",
};

// Texto em contorno: devolve o "d" do path e a largura em pixels.
function texto(conteudo, { tamanho, wdth = 100, wght = 400, maiusculas = false }) {
  const fonte = base.getVariation({ wdth, wght });
  const run = fonte.layout(maiusculas ? conteudo.toUpperCase() : conteudo);
  const escala = tamanho / fonte.unitsPerEm;
  let x = 0;
  const partes = [];
  run.glyphs.forEach((glifo, i) => {
    const pos = run.positions[i];
    const d = glifo.path
      .scale(escala, -escala)
      .translate(x + pos.xOffset * escala, -pos.yOffset * escala)
      .toSVG();
    if (d) partes.push(d);
    x += pos.xAdvance * escala;
  });
  return { d: partes.join(" "), largura: x };
}

function linha(conteudo, opcoes, x, y, preenchimento) {
  const t = texto(conteudo, opcoes);
  return { svg: `<path transform="translate(${x} ${y})" d="${t.d}" fill="${preenchimento}"/>`, largura: t.largura };
}

// Capa 1200x630: foto do Big Ben à direita, nome e chamada à esquerda.
async function capa() {
  const W = 1200;
  const H = 630;
  const fotoW = 470;

  // Corta a borda esquerda, onde entra um poste na foto original.
  const foto = await sharp(path.join(root, "assets/fotos/londres-big-ben-gustavo.jpg"))
    .extract({ left: 110, top: 0, width: 976, height: 1448 })
    .resize(fotoW, H, { fit: "cover", position: "attention" })
    .toBuffer();

  const nome = { tamanho: 178, wdth: 62, wght: 900, maiusculas: true };
  const chamada = { tamanho: 42, wdth: 80, wght: 800 };
  const textos = [
    linha("Teacher de inglês", { tamanho: 28, wdth: 90, wght: 600 }, 72, 112, "rgba(241,235,223,0.7)").svg,
    linha("Gustavo", nome, 66, 296, cor.off).svg,
    linha("Leal", nome, 66, 450, cor.off).svg,
    linha("Inglês pra viver o mundo,", chamada, 72, 530, cor.off).svg,
    linha("não pra decorar regra.", chamada, 72, 578, cor.vermelho).svg,
  ];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="fundo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${cor.preto}"/>
      <stop offset="0.55" stop-color="${cor.vinhoEscuro}"/>
      <stop offset="1" stop-color="${cor.vinho}"/>
    </linearGradient>
    <radialGradient id="brilho" cx="0.62" cy="0.45" r="0.55">
      <stop offset="0" stop-color="${cor.vinhoClaro}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${cor.vinhoClaro}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fusao" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${cor.vinhoEscuro}" stop-opacity="1"/>
      <stop offset="0.35" stop-color="${cor.vinhoEscuro}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fundo)"/>
  <rect width="${W}" height="${H}" fill="url(#brilho)"/>
  <image href="data:image/jpeg;base64,${foto.toString("base64")}" x="${W - fotoW}" y="0" width="${fotoW}" height="${H}"/>
  <rect x="${W - fotoW}" y="0" width="${fotoW}" height="${H}" fill="url(#fusao)"/>
  ${textos.join("\n  ")}
</svg>`;

  await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(root, "public/og.jpg"));
  console.log("capa pronta: public/og.jpg");
}

// Ícone: a placa vinho com "L" do header, em vetor.
async function icones() {
  const L = texto("L", { tamanho: 420, wdth: 62, wght: 900 });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="${cor.vinho}"/>
  <path transform="translate(${(512 - L.largura) / 2} 404)" d="${L.d}" fill="${cor.off}"/>
</svg>
`;
  writeFileSync(path.join(root, "public/icon.svg"), svg);
  await sharp(Buffer.from(svg)).resize(180, 180).png().toFile(path.join(root, "public/apple-touch-icon.png"));
  await sharp(Buffer.from(svg)).resize(32, 32).png().toFile(path.join(root, "public/favicon-32.png"));
  await sharp(Buffer.from(svg)).resize(512, 512).png().toFile(path.join(root, "public/icon-512.png"));
  console.log("ícones prontos");
}

await capa();
await icones();
