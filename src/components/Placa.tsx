type Props = {
  numero: string;
  nome: string;
  className?: string;
};

// Rótulo de seção no formato das placas de rua de Paris:
// fundo vinho, filete off-white por dentro e cantos arredondados.
export function Placa({ numero, nome, className = "" }: Props) {
  return (
    <div className={`inline-flex items-stretch rounded-md bg-vinho p-1 text-off shadow-[0_2px_0_rgb(0_0_0/0.35)] ${className}`}>
      <div className="flex items-center gap-3 rounded-[4px] border border-off/80 px-3 py-1.5">
        <span className="etiqueta text-off/60">{numero}</span>
        <span className="h-4 w-px bg-off/50" />
        <span className="etiqueta font-bold">{nome}</span>
      </div>
    </div>
  );
}
