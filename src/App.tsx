import { SmoothScroll } from "./components/SmoothScroll";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Apresentacao } from "./components/Apresentacao";
import { Metodologia } from "./components/Metodologia";
import { Alunos } from "./components/Alunos";
import { Trajetoria } from "./components/Trajetoria";
import { Planos } from "./components/Planos";
import { Cta } from "./components/Cta";
import { Rodape } from "./components/Rodape";
import { Movimento } from "./components/Movimento";
import { temDepoimentos } from "./lib/content";

function App() {
  return (
    <>
      <SmoothScroll />
      <Header />
      <main>
        <Hero />
        <Apresentacao />
        <Metodologia />
        {temDepoimentos && <Alunos />}
        <Trajetoria />
        <Planos />
        <Cta />
      </main>
      <Rodape />
      <Movimento />
    </>
  );
}

export default App;
