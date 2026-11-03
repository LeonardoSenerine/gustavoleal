// Gera a capa de compartilhamento (og.jpg) e os ícones do site.
// O texto vira contorno vetorial direto das fontes do site (Archivo e
// IBM Plex Mono), então a capa tem a mesma tipografia sem depender de
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
const mono = await abrirFonte("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2");

// As mesmas cores do caderno no site (src/style.css).
const cor = {
  preto: "#0d0b0a",
  off: "#f1ebdf",
  folha: "#faf6ee",
  papel: "#e6ddcc",
  caneta: "#d7263d",
};

// Texto em contorno: devolve o "d" do path e a largura em pixels.
// "display" é a voz dos títulos do site: Archivo no eixo mais estreito e
// pesado, em caixa alta. "espaco" é o tracking em em.
function texto(conteudo, { fonte = "sans", tamanho, wght = 400, espaco = 0 }) {
  const instancia =
    fonte === "mono" ? mono : fonte === "display" ? archivo.getVariation({ wdth: 62, wght: 800 }) : archivo.getVariation({ wdth: 100, wght });
  const run = instancia.layout(fonte === "display" ? conteudo.toLocaleUpperCase("pt-BR") : conteudo);
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

// Foto recortada com cantos quase retos, em base64 pra entrar no SVG.
// Sai no dobro do tamanho pra ficar nítida depois de girar a ficha.
async function foto(arquivo, largura, altura) {
  const [w, h] = [largura * 2, altura * 2];
  const mascara = Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="6" fill="#fff"/></svg>`);
  const buffer = await sharp(path.join(root, "assets/fotos", arquivo))
    .resize(w, h, { fit: "cover", position: "attention" })
    .composite([{ input: mascara, blend: "dest-in" }])
    .png()
    .toBuffer();
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

// Ficha de estudo, como as do hero: foto, a palavra em inglês e a caixinha.
async function ficha({ x, y, giro, arquivo, palavra, sentido, marcada }) {
  const w = 218;
  const p = 10;
  const fw = w - p * 2;
  const fh = 238;
  const h = p + fh + 96;
  const img = await foto(arquivo, fw, fh);
  const titulo = texto(palavra, { fonte: "display", tamanho: 44 });
  const legenda = texto(sentido, { tamanho: 16, wght: 500 });
  const caixa = { x: w - p - 6 - 28, y: p + fh + 22, l: 28 };
  return `<g transform="rotate(${giro} ${x + w / 2} ${y + h / 2}) translate(${x} ${y})">
    <rect x="4" y="22" width="${w - 8}" height="${h - 12}" rx="4" fill="${cor.preto}" opacity="0.28" filter="url(#sombra)"/>
    <rect width="${w}" height="${h}" rx="4" fill="${cor.folha}" stroke="${marcada ? cor.caneta : "rgba(13,11,10,0.08)"}" stroke-width="${marcada ? 2 : 1}"/>
    <image href="${img}" x="${p}" y="${p}" width="${fw}" height="${fh}"/>
    <path transform="translate(${p + 6} ${p + fh + 58})" d="${titulo.d}" fill="${cor.preto}"/>
    <path transform="translate(${p + 6} ${p + fh + 82})" d="${legenda.d}" fill="rgba(13,11,10,0.55)"/>
    <rect x="${caixa.x}" y="${caixa.y}" width="${caixa.l}" height="${caixa.l}" fill="none" stroke="${marcada ? cor.caneta : "rgba(13,11,10,0.3)"}" stroke-width="1.5"/>
    ${
      marcada
        ? `<path transform="translate(${caixa.x - 1} ${caixa.y - 8}) scale(0.85)" d="M5 21C9 25 13 30 16 35C22 22 30 11 38 3" fill="none" stroke="${cor.caneta}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`
        : ""
    }
  </g>`;
}

// Capa 1200x630 na linguagem do site: folha pautada com a linha vermelha
// da margem, o título enorme à esquerda com "decorar regra" riscado pela
// caneta e duas fichas de estudo soltas à direita.
async function capa() {
  const W = 1200;
  const H = 630;
  const margem = 46;
  const x0 = margem + 46;

  // O título ocupa a coluna da esquerda inteira.
  const coluna = 612;
  const base = texto("Viver o mundo.", { fonte: "display", tamanho: 100, espaco: -0.012 });
  const t = Math.floor((coluna / base.largura) * 100);
  const capAltura = (archivo.capHeight / archivo.unitsPerEm) * t;
  const y1 = 70 + capAltura;
  const y2 = y1 + t * 0.88;

  const sub = { tamanho: 44, wght: 500, espaco: -0.035 };
  const antes = texto("Não pra ", sub);
  const riscado = texto("decorar regra.", sub);
  const y3 = y2 + 80;
  const r = { x1: x0 + antes.largura - 6, x2: x0 + antes.largura + riscado.largura + 8, y: y3 - sub.tamanho * 0.3 };

  // Verbete de dicionário, como no hero do site (a mono não tem os
  // símbolos fonéticos, então a capa fica sem a transcrição).
  const yv = y3 + 66;
  const verbete = [
    linha("live", { fonte: "mono", tamanho: 21 }, x0 + 18, yv, cor.preto),
    linha("verbo", { fonte: "mono", tamanho: 16 }, x0 + 18 + 62, yv, "rgba(13,11,10,0.45)"),
    linha("1. viver; ter experiências de verdade.", { fonte: "mono", tamanho: 16 }, x0 + 18, yv + 30, "rgba(13,11,10,0.7)"),
    linha("2. ao vivo; na hora, sem ensaio.", { fonte: "mono", tamanho: 16 }, x0 + 18, yv + 54, "rgba(13,11,10,0.7)"),
  ];

  const pauta = Array.from({ length: Math.ceil(H / 36) }, (_, i) => `<path d="M0 ${i * 36 + 35.5}H${W}" stroke="rgba(13,11,10,0.06)"/>`).join("");

  const fichas = [
    await ficha({ x: 708, y: 58, giro: -4, arquivo: "londres-cabine.jpg", palavra: "Travel", sentido: "viagens", marcada: true }),
    await ficha({ x: 952, y: 92, giro: 3.2, arquivo: "cafe-paris.jpg", palavra: "Work", sentido: "trabalho", marcada: false }),
  ];

  const assinatura = linha("Gustavo Leal", { fonte: "display", tamanho: 40 }, x0, 572, cor.preto);
  const papel = linha("Teacher de inglês · online ou presencial", { tamanho: 19, wght: 500 }, x0 + assinatura.largura + 18, 568, "rgba(13,11,10,0.6)");
  // A Archivo do site não tem a seta, então ela vai desenhada.
  const botaoTexto = texto("Aula experimental grátis", { tamanho: 20, wght: 650 });
  const botao = { w: botaoTexto.largura + 52 + 30, h: 58 };
  botao.x = W - 64 - botao.w;
  botao.y = 534;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <filter id="sombra" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="16"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="${cor.off}"/>
  ${pauta}
  <rect x="${margem}" width="1.5" height="${H}" fill="${cor.caneta}"/>
  ${linha("Inglês pra", { fonte: "display", tamanho: t, espaco: -0.012 }, x0 - 4, y1, cor.preto).svg}
  ${linha("Viver o mundo.", { fonte: "display", tamanho: t, espaco: -0.012 }, x0 - 4, y2, cor.preto).svg}
  <path transform="translate(${x0} ${y3})" d="${antes.d}" fill="${cor.preto}"/>
  <path transform="translate(${x0 + antes.largura} ${y3})" d="${riscado.d}" fill="${cor.preto}"/>
  <rect x="${x0}" y="${yv - 20}" width="1.5" height="82" fill="rgba(13,11,10,0.18)"/>
  ${verbete.map((v) => v.svg).join("\n  ")}
  <path d="M${r.x1} ${r.y + 5}C${r.x1 + 90} ${r.y + 3} ${r.x2 - 120} ${r.y - 1} ${r.x2} ${r.y - 5}" fill="none" stroke="${cor.caneta}" stroke-width="5" stroke-linecap="round"/>
  ${fichas.join("\n  ")}
  ${assinatura.svg}
  ${papel.svg}
  <rect x="${botao.x}" y="${botao.y}" width="${botao.w}" height="${botao.h}" rx="2" fill="${cor.preto}"/>
  <path transform="translate(${botao.x + 26} ${botao.y + 36})" d="${botaoTexto.d}" fill="${cor.off}"/>
  <path transform="translate(${botao.x + 26 + botaoTexto.largura + 14} ${botao.y + 29})" d="M0 0H16M10 -6L16 0L10 6" fill="none" stroke="${cor.off}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  await sharp(Buffer.from(svg)).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(root, "public/og.jpg"));
  console.log(`capa pronta: public/og.jpg (título em ${t}px)`);
}

// Ícone: o "G" estreito e pesado dos títulos, com o ponto da caneta.
async function icones() {
  const tamanho = 400;
  const G = texto("G", { fonte: "display", tamanho });
  const capAltura = (archivo.capHeight / archivo.unitsPerEm) * tamanho;
  const raio = 30;
  const larguraTotal = G.largura + 14 + raio * 2;
  const x = (512 - larguraTotal) / 2;
  const y = (512 + capAltura) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="${cor.preto}"/>
  <path transform="translate(${x} ${y})" d="${G.d}" fill="${cor.off}"/>
  <circle cx="${x + G.largura + 14 + raio}" cy="${y - raio}" r="${raio}" fill="${cor.caneta}"/>
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
