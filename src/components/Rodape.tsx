import { contato, linkWhatsApp } from "@/lib/content";

export function Rodape() {
  const telefone = contato.whatsapp.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");

  return (
    <footer className="bg-preto text-off">
      <div className="h-1 bg-[linear-gradient(90deg,var(--color-vinho-escuro),var(--color-vermelho),var(--color-vinho-escuro))]" aria-hidden />
      <div className="grid gap-10 px-4 py-14 md:grid-cols-12 md:px-8">
        <div className="md:col-span-6">
          <span className="letreiro block text-[22vw] leading-[0.78] md:text-[11vw]">
            Teacher
            <br />
            <span className="text-vermelho">Leal</span>
          </span>
        </div>
        <div className="flex flex-col justify-end gap-6 md:col-span-5 md:col-start-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="etiqueta text-off/50">WhatsApp</span>
              <a href={linkWhatsApp()} target="_blank" rel="noreferrer" className="mt-2 block text-lg font-bold hover:text-vermelho">
                {telefone}
              </a>
            </div>
            {contato.instagram && (
              <div>
                <span className="etiqueta text-off/50">Instagram</span>
                <a href={`https://instagram.com/${contato.instagram}`} target="_blank" rel="noreferrer" className="mt-2 block text-lg font-bold hover:text-vermelho">
                  @{contato.instagram}
                </a>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 border-t border-off/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="etiqueta text-off/40">© {new Date().getFullYear()} Gustavo Leal · Aulas de inglês</p>
            <a href="/privacidade/" className="text-sm text-off/60 underline-offset-4 transition-colors hover:text-off hover:underline">
              Privacidade e cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
