// Cada foto existe em 700 e 1400 px (ver scripts/prepare-media.mjs).
// O navegador escolhe pela largura que a foto ocupa na tela, informada em
// "sizes" em cada lugar que usa.
export function foto(nome: string) {
  return {
    src: `/fotos/${nome}-700.webp`,
    srcSet: `/fotos/${nome}-700.webp 700w, /fotos/${nome}.webp 1400w`,
  };
}
