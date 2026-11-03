import { contato, linkWhatsApp } from "@/lib/content";

// Rodapé como a última linha do caderno: o nome em letra enorme, de ponta a ponta.
export function Rodape() {
  const telefone = contato.whatsapp.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");

  return (
    <footer className="relative overflow-hidden bg-off text-preto">
      <div className="recuo mx-auto max-w-[1500px] pt-14 md:pt-20">
        <div className="grid gap-8 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-4">
            <p className="nota-caps text-preto/45">WhatsApp</p>
            <a href={linkWhatsApp()} target="_blank" rel="noreferrer" className="mt-2 block text-2xl font-semibold whitespace-nowrap transition-colors hover:text-caneta">
              {telefone}
            </a>
          </div>
          {contato.instagram && (
            <div className="md:col-span-3">
              <p className="nota-caps text-preto/45">Instagram</p>
              <a href={`https://instagram.com/${contato.instagram}`} target="_blank" rel="noreferrer" className="mt-2 block text-2xl font-semibold transition-colors hover:text-caneta">
                @{contato.instagram}
              </a>
            </div>
          )}
          <div className="nota flex flex-col gap-1.5 text-preto/55 md:col-span-4 md:col-start-9 md:items-end">
            <p>Teacher de inglês · online ou presencial</p>
            <a href="/privacidade/" className="underline-offset-4 transition-colors hover:text-preto hover:underline">
              Privacidade e cookies
            </a>
            <p>
              © {new Date().getFullYear()} Gustavo Leal · site por{" "}
              <a href="https://senerine.dev" target="_blank" rel="noreferrer" className="text-preto/75 underline-offset-4 hover:text-caneta hover:underline">
                senerine.dev
              </a>
            </p>
          </div>
        </div>

        <p className="display mt-14 text-[clamp(3rem,16.6vw,16.5rem)] leading-[0.8] whitespace-nowrap md:mt-20" aria-hidden>
          Gustavo Leal<span className="text-caneta">.</span>
        </p>
      </div>
    </footer>
  );
}
