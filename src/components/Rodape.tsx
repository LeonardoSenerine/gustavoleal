import { contato, linkWhatsApp } from "@/lib/content";

export function Rodape() {
  const telefone = contato.whatsapp.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");

  return (
    <footer className="bg-off text-preto">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-12 md:items-end md:px-8 md:py-16">
        <p className="text-[clamp(3.2rem,9vw,7rem)] leading-[0.9] font-medium tracking-[-0.04em] md:col-span-7">
          <span className="font-serif tracking-[-0.01em] text-vinho italic">Gustavo</span> Leal
          <span className="mt-3 block text-lg font-medium tracking-normal text-preto/60">Teacher de inglês · online ou presencial</span>
        </p>
        <div className="flex flex-col gap-6 md:col-span-4 md:col-start-9">
          <div className="flex flex-wrap gap-x-10 gap-y-6">
            <div>
              <p className="text-sm font-semibold text-preto/50">WhatsApp</p>
              <a href={linkWhatsApp()} target="_blank" rel="noreferrer" className="mt-1 block text-lg font-semibold whitespace-nowrap hover:text-vinho">
                {telefone}
              </a>
            </div>
            {contato.instagram && (
              <div>
                <p className="text-sm font-semibold text-preto/50">Instagram</p>
                <a href={`https://instagram.com/${contato.instagram}`} target="_blank" rel="noreferrer" className="mt-1 block text-lg font-semibold hover:text-vinho">
                  @{contato.instagram}
                </a>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 border-t border-preto/10 pt-5 text-sm text-preto/55 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Gustavo Leal</p>
            <a href="/privacidade/" className="underline-offset-4 transition-colors hover:text-preto hover:underline">
              Privacidade e cookies
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-8 md:px-8">
        <p className="text-sm text-preto/45">
          Desenvolvido por{" "}
          <a
            href="https://senerine.dev"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-preto/70 underline-offset-4 transition-colors hover:text-vinho hover:underline"
          >
            senerine.dev
          </a>
        </p>
      </div>
    </footer>
  );
}
