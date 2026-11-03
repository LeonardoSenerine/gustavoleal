// Gera a capa de compartilhamento (og.jpg) e os ícones do site.
// O texto vira contorno vetorial direto da fonte do site (Archivo), então
// a capa tem a mesma tipografia sem depender de fonte instalada. Rode com: npm run marca
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

// As mesmas cores do caderno no site (src/style.css).
const cor = {
  preto: "#0d0b0a",
  off: "#f1ebdf",
  caneta: "#d7263d",
};

// Texto em contorno: devolve o "d" do path e a largura em pixels.
// "display" é a voz dos títulos do site: Archivo no eixo mais estreito e
// pesado, em caixa alta. "espaco" é o tracking em em.
function texto(conteudo, { fonte = "sans", tamanho, wght = 400, espaco = 0 }) {
  const instancia =
    fonte === "display" ? archivo.getVariation({ wdth: 62, wght: 800 }) : archivo.getVariation({ wdth: 100, wght });
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

// Recorte com ponto de foco: (fx, fy) de 0 a 1 é onde o Gustavo está na
// foto, e o recorte tenta mantê-lo dentro, centralizado na horizontal.
async function recorte(arquivo, largura, altura, fx = 0.5, fy = 0.5) {
  const imagem = sharp(path.join(root, "assets/fotos", arquivo));
  const { width: W, height: H } = await imagem.metadata();
  const escala = Math.max(largura / W, altura / H);
  const [w, h] = [Math.round(largura / escala), Math.round(altura / escala)];
  const left = Math.min(Math.max(Math.round(fx * W - w / 2), 0), W - w);
  const top = Math.min(Math.max(Math.round(fy * H - h / 2), 0), H - h);
  const buffer = await imagem.extract({ left, top, width: w, height: h }).resize(largura * 2, altura * 2).png().toBuffer();
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

// Capa 1200x630: a folha pautada com a linha vermelha da margem à
// esquerda, com o título, a frase riscada, a legenda em inglês, uma linha
// sobre as aulas, o botão e o nome; à direita, três tiras com o Gustavo em
// Londres, Paris e Barcelona.
async function capa() {
  const W = 1200;
  const H = 630;
  const margem = 46;
  const x0 = margem + 46;

  const tiraW = 196;
  const gap = 8;
  const xFotos = W - (tiraW * 3 + gap * 2);
  // Ponto de foco (de 0 a 1) de cada foto, pra ele e o lugar caberem na tira.
  const fotos = [
    await recorte("londres-big-ben-gustavo.jpg", tiraW, H, 0.5, 0.55),
    await recorte("eiffel-noite.jpg", tiraW, H, 0.52, 0.5),
    await recorte("sagrada.jpg", tiraW, H, 0.55, 0.5),
  ];

  // O título ocupa a coluna da folha inteira.
  const coluna = xFotos - x0 - 44;
  const base = texto("Viver o mundo.", { fonte: "display", tamanho: 100, espaco: -0.012 });
  const t = Math.floor((coluna / base.largura) * 100);
  const y1 = 80 + (archivo.capHeight / archivo.unitsPerEm) * t;
  const y2 = y1 + t * 0.88;

  // "Não pra decorar regra." com o risco da caneta, como no hero.
  const sub = { tamanho: 38, wght: 500, espaco: -0.035 };
  const antes = texto("Não pra ", sub);
  const riscado = texto("decorar regra.", sub);
  const y3 = y2 + 74;
  const r = { x1: x0 + antes.largura - 5, x2: x0 + antes.largura + riscado.largura + 7, y: y3 - sub.tamanho * 0.3 };

  // Legenda em inglês em vermelho, como no site, ajustada à coluna.
  const fraseIngles = "Learn English to live it, not to memorize it.";
  const tamIngles = Math.min(24, Math.floor((coluna / texto(fraseIngles, { tamanho: 100, wght: 500, espaco: -0.02 }).largura) * 100));
  const ingles = linha(fraseIngles, { tamanho: tamIngles, wght: 500, espaco: -0.02 }, x0, y3 + 54, cor.caneta);
  const descricao = linha("Aulas personalizadas, online ou presencial.", { tamanho: 19, wght: 500 }, x0, y3 + 94, "rgba(13,11,10,0.62)");

  // Botão da aula grátis. A Archivo do site não tem a seta, então ela vai desenhada.
  const botaoTexto = texto("Aula experimental grátis", { tamanho: 19, wght: 650 });
  const botao = { x: x0, y: y3 + 128, w: botaoTexto.largura + 48 + 28, h: 54 };

  const pauta = Array.from({ length: Math.ceil(H / 36) }, (_, i) => `<path d="M0 ${i * 36 + 35.5}H${xFotos}" stroke="rgba(13,11,10,0.06)"/>`).join("");
  const nome = linha("Gustavo Leal", { fonte: "display", tamanho: 40 }, x0, 566, cor.preto);
  const papel = linha("teacher de inglês", { tamanho: 20, wght: 500 }, x0 + nome.largura + 16, 562, "rgba(13,11,10,0.6)");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${cor.off}"/>
  ${pauta}
  <rect x="${margem}" width="1.5" height="${H}" fill="${cor.caneta}"/>
  ${fotos.map((f, i) => `<image href="${f}" x="${xFotos + i * (tiraW + gap)}" y="0" width="${tiraW}" height="${H}" preserveAspectRatio="none"/>`).join("\n  ")}
  ${linha("Inglês pra", { fonte: "display", tamanho: t, espaco: -0.012 }, x0 - 4, y1, cor.preto).svg}
  ${linha("Viver o mundo.", { fonte: "display", tamanho: t, espaco: -0.012 }, x0 - 4, y2, cor.preto).svg}
  <path transform="translate(${x0} ${y3})" d="${antes.d}" fill="${cor.preto}"/>
  <path transform="translate(${x0 + antes.largura} ${y3})" d="${riscado.d}" fill="${cor.preto}"/>
  <path d="M${r.x1} ${r.y + 4}C${r.x1 + 80} ${r.y + 2} ${r.x2 - 100} ${r.y - 1} ${r.x2} ${r.y - 4}" fill="none" stroke="${cor.caneta}" stroke-width="4.5" stroke-linecap="round"/>
  ${ingles.svg}
  ${descricao.svg}
  <rect x="${botao.x}" y="${botao.y}" width="${botao.w}" height="${botao.h}" rx="2" fill="${cor.preto}"/>
  <path transform="translate(${botao.x + 24} ${botao.y + 34})" d="${botaoTexto.d}" fill="${cor.off}"/>
  <path transform="translate(${botao.x + 24 + botaoTexto.largura + 12} ${botao.y + 27})" d="M0 0H15M9 -6L15 0L9 6" fill="none" stroke="${cor.off}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  ${nome.svg}
  ${papel.svg}
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
