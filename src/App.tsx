import { lazy, Suspense } from "react";
import { SmoothScroll } from "./components/SmoothScroll";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Fichas } from "./components/Fichas";
import { versaoHero } from "./lib/versao";
import { Apresentacao } from "./components/Apresentacao";
import { Metodologia } from "./components/Metodologia";
import { Alunos } from "./components/Alunos";
import { Trajetoria } from "./components/Trajetoria";
import { Planos } from "./components/Planos";
import { Perguntas } from "./components/Perguntas";
import { Cta } from "./components/Cta";
import { Rodape } from "./components/Rodape";
import { Movimento } from "./components/Movimento";
import { LinhaMargem } from "./components/LinhaMargem";
import { temDepoimentos } from "./lib/content";

// As versões do hero (?hero=1 a 4) só são baixadas quando pedidas no
// endereço; quem entra no site normal não carrega esse código.
const versoes = {
  "1": lazy(() => import("./components/HeroVersoes").then((m) => ({ default: m.HeroVideo }))),
  "2": lazy(() => import("./components/HeroVersoes").then((m) => ({ default: m.HeroConversa }))),
  "3": lazy(() => import("./components/HeroVersoes").then((m) => ({ default: m.HeroObjetivos }))),
  "4": lazy(() => import("./components/HeroVersoes").then((m) => ({ default: m.HeroPessoal }))),
} as const;

function Abertura() {
  if (!versaoHero) return <Hero />;
  const Versao = versoes[versaoHero as keyof typeof versoes];
  return (
    <Suspense fallback={<section id="topo" className="min-h-[100svh] bg-off" />}>
      <Versao />
    </Suspense>
  );
}

function App() {
  return (
    <>
      <SmoothScroll />
      <Header />
      <LinhaMargem />
      <main>
        <Abertura />
        {/* Na versão 3 as fichas já estão na abertura. */}
        {versaoHero !== "3" && (
          <section className="bg-off pt-20 pb-16 text-preto md:pt-36 md:pb-28">
            <Fichas />
          </section>
        )}
        <Apresentacao />
        <Metodologia />
        {temDepoimentos && <Alunos />}
        <Trajetoria />
        <Planos />
        <Perguntas />
        <Cta />
      </main>
      <Rodape />
      <Movimento />
    </>
  );
}

export default App;
