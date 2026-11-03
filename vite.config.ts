import path from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Páginas indexáveis. A 404 fica de fora do sitemap de propósito.
const paginas = [
  { caminho: "/", prioridade: "1.0" },
  { caminho: "/privacidade/", prioridade: "0.3" },
];

// robots.txt e sitemap.xml gerados a partir do VITE_SITE_URL, servidos no
// dev e gravados no build, pra nunca ficarem com o domínio desatualizado.
function seo(site: string): Plugin {
  const hoje = new Date().toISOString().slice(0, 10);
  const arquivos: Record<string, { tipo: string; conteudo: string }> = {
    "robots.txt": {
      tipo: "text/plain",
      conteudo: `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`,
    },
    "sitemap.xml": {
      tipo: "application/xml",
      conteudo: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paginas
  .map((p) => `  <url>\n    <loc>${site}${p.caminho}</loc>\n    <lastmod>${hoje}</lastmod>\n    <priority>${p.prioridade}</priority>\n  </url>`)
  .join("\n")}
</urlset>
`,
    },
  };

  return {
    name: "seo-arquivos",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const arquivo = arquivos[req.url?.slice(1) ?? ""];
        if (!arquivo) return next();
        res.setHeader("Content-Type", `${arquivo.tipo}; charset=utf-8`);
        res.end(arquivo.conteudo);
      });
    },
    generateBundle() {
      for (const [fileName, { conteudo }] of Object.entries(arquivos)) {
        this.emitFile({ type: "asset", fileName, source: conteudo });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, "");
  const site = env.VITE_SITE_URL.replace(/\/$/, "");

  return {
    plugins: [react(), tailwindcss(), seo(site)],
    resolve: {
      alias: { "@": path.resolve(import.meta.dirname, "src") },
    },
    build: {
      rollupOptions: {
        input: {
          inicio: path.resolve(import.meta.dirname, "index.html"),
          privacidade: path.resolve(import.meta.dirname, "privacidade/index.html"),
          naoEncontrada: path.resolve(import.meta.dirname, "404.html"),
        },
      },
    },
  };
});
