import { SmoothScroll } from "./components/SmoothScroll";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Fichas } from "./components/Fichas";
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
import { previaAlunos } from "./lib/alunos";

function App() {
  return (
    <>
      <SmoothScroll />
      <Header />
      <LinhaMargem />
      <main>
        <Hero />
        <section className="bg-off pt-20 pb-16 text-preto md:pt-36 md:pb-28">
          <Fichas />
        </section>
        <Apresentacao />
        <Metodologia />
        {(temDepoimentos || previaAlunos) && <Alunos />}
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
