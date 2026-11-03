// Gera a capa de compartilhamento (og.jpg) e os ícones do site.
// O texto vira contorno vetorial direto das fontes do site (Archivo e
// Instrument Serif), então a capa tem a mesma tipografia sem depender de
// fonte instalada. Rode com: npm run marca
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as fontkit from "fontkit";
import sharp from "sharp";
import wawoff2 from "wawoff2";

const root = path.resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);

// O fontkit só aplica os eixos variáveis (largura e peso) em TTF, então os
// WOFF2 do site são descompactados antes.
async function abrirFonte(pacote) {
  return fontkit.create(Buffer.from(await wawoff2.decompress(readFileSync(require.resolve(pacote)))));
}
const archivo = await abrirFonte("@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2");
const serifa = await abrirFonte("@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2");

const cor = {
  vinho: "#6b1020",
  vinhoEscuro: "#3d0912",
  preto: "#0d0b0a",
  off: "#f1ebdf",
  papel: "#e6ddcc",
  rosa: "#e9a7b1",
};

// Texto em contorno: devolve o "d" do path e a largura em pixels.
// "espaco" é o tracking em em, como o tracking-[-0.035em] do site.
function texto(conteudo, { fonte = archivo, tamanho, wght = 400, espaco = 0 }) {
  const instancia = fonte === archivo ? archivo.getVariation({ wdth: 100, wght }) : fonte;
  const run = instancia.layout(conteudo);
  const escala = tamanho / instancia.unitsPerEm;
  let x = 0;
  const partes = [];
  run.glyphs.forEach((glifo, i) => {
    const pos = run.positions[i];
    const d = glifo.path
      .scale(escala, -escala)
      .translate(x + pos.xOffset * escala, -pos.yOffset * escala)
      .toSVG();
    if (d) partes.push(d);
    x += pos.xAdvance * escala + espaco * tamanho;
  });
  return { d: partes.join(" "), largura: x - espaco * tamanho };
}

function linha(conteudo, opcoes, x, y, preenchimento) {
  const t = texto(conteudo, opcoes);
  return { svg: `<path transform="translate(${x} ${y})" d="${t.d}" fill="${preenchimento}"/>`, largura: t.largura };
}

// Foto recortada em cartão arredondado, em base64 pra entrar no SVG.
async function cartao(arquivo, largura, altura) {
  const mascara = Buffer.from(`<svg width="${largura}" height="${altura}"><rect width="${largura}" height="${altura}" rx="18" fill="#fff"/></svg>`);
  const buffer = await sharp(path.join(root, "assets/fotos", arquivo))
    .resize(largura, altura, { fit: "cover", position: "attention" })
    .composite([{ input: mascara, blend: "dest-in" }])
    .png()
    .toBuffer();
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

// Capa 1200x630 no estilo do hero: fundo claro, título em duas vozes à
// esquerda e o balão de fala escuro com dois cartões à direita.
async function capa() {
  const W = 1200;
  const H = 630;
  const margem = 72;

  // Balão
  const balao = { x: 742, y: 64, w: 390, h: 440 };
  const cw = 160;
  const ch = 214;
  const cy = balao.y + 104;
  const c1 = { x: balao.x + 28, img: await cartao("londres-cabine.jpg", cw, ch), titulo: "Viagens" };
  const c2 = { x: balao.x + 28 + cw + 14, img: await cartao("cafe-paris.jpg", cw, ch), titulo: "Trabalho" };

  const rotuloTexto = texto("Trabalho · Viagens · Cultura · Novas perspectivas", { tamanho: 17, wght: 600 });
  const pergunta = texto("O que você quer destravar?", { tamanho: 17, wght: 500 });

  const partes = [
    // Pílula do topo
    `<rect x="${margem}" y="78" width="${rotuloTexto.largura + 36}" height="38" rx="19" fill="${cor.papel}"/>`,
    `<path transform="translate(${margem + 18} 103)" d="${rotuloTexto.d}" fill="rgba(13,11,10,0.7)"/>`,
    // Título em duas vozes
    linha("Inglês pra viver", { tamanho: 74, wght: 500, espaco: -0.035 }, margem - 3, 222, cor.preto).svg,
    linha("o mundo.", { tamanho: 74, wght: 500, espaco: -0.035 }, margem - 3, 298, cor.preto).svg,
    linha("Não pra decorar regra.", { fonte: serifa, tamanho: 80, espaco: -0.01 }, margem - 2, 380, cor.vinho).svg,
    // Assinatura
    linha("Gustavo Leal", { tamanho: 26, wght: 700, espaco: -0.01 }, margem + 74, 527, cor.preto).svg,
    linha("Teacher de inglês · online ou presencial", { tamanho: 20, wght: 500 }, margem + 74, 556, "rgba(13,11,10,0.6)").svg,
    // Balão de fala
    `<rect x="${balao.x}" y="${balao.y}" width="${balao.w}" height="${balao.h}" rx="36" fill="url(#balao)"/>`,
    `<path d="M${balao.x + 70} ${balao.y + balao.h - 1}h78c-17 5-38 24-56 64c3-28-7-52-22-64z" fill="${cor.preto}"/>`,
    ...[0, 1, 2].map((i) => `<circle cx="${balao.x + 36 + i * 11}" cy="${balao.y + 56}" r="3.5" fill="${cor.rosa}" opacity="${0.5 + i * 0.25}"/>`),
    `<path transform="translate(${balao.x + 76} ${balao.y + 62})" d="${pergunta.d}" fill="rgba(241,235,223,0.85)"/>`,
  ];

  for (const c of [c1, c2]) {
    partes.push(`<image href="${c.img}" x="${c.x}" y="${cy}" width="${cw}" height="${ch}"/>`);
    partes.push(`<rect x="${c.x}" y="${cy}" width="${cw}" height="${ch}" rx="18" fill="url(#sombra)"/>`);
    partes.push(linha(c.titulo, { fonte: serifa, tamanho: 34 }, c.x + 14, cy + ch - 18, cor.off).svg);
  }
  partes.push(linha("Aula experimental grátis", { tamanho: 18, wght: 600 }, balao.x + 28, balao.y + balao.h - 36, cor.off).svg);

  const avatar = await sharp(path.join(root, "public/media/apresentacao.jpg"))
    .extract({ left: 120, top: 170, width: 340, height: 340 })
    .resize(60, 60)
    .composite([{ input: Buffer.from('<svg width="60" height="60"><circle cx="30" cy="30" r="30" fill="#fff"/></svg>'), blend: "dest-in" }])
    .png()
    .toBuffer();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="balao" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${cor.vinho}"/>
      <stop offset="0.45" stop-color="${cor.vinhoEscuro}"/>
      <stop offset="1" stop-color="${cor.preto}"/>
    </linearGradient>
    <linearGradient id="sombra" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.35" stop-color="${cor.preto}" stop-opacity="0"/>
      <stop offset="1" stop-color="${cor.preto}" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${cor.off}"/>
  <image href="data:image/png;base64,${avatar.toString("base64")}" x="${margem}" y="502" width="60" height="60"/>
  ${partes.join("\n  ")}
</svg>`;

  await sharp(Buffer.from(svg)).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(root, "public/og.jpg"));
  console.log("capa pronta: public/og.jpg");
}

// Ícone: o "G" em serifa itálica do logo, sobre o vinho.
async function icones() {
  const G = texto("G", { fonte: serifa, tamanho: 430 });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="${cor.vinho}"/>
  <path transform="translate(${(512 - G.largura) / 2} 380)" d="${G.d}" fill="${cor.off}"/>
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
