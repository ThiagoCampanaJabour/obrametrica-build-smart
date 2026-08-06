import { useState } from "react";

export function ExportButtons({
  onExportCSV,
  onExportJSON,
  onCopy,
}: {
  onExportCSV: () => void;
  onExportJSON: () => void;
  onCopy: () => Promise<void> | void;
}) {
  const [copiado, setCopiado] = useState(false);
  const cls =
    "rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted";

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <button type="button" onClick={onExportCSV} className={cls}>
        Exportar CSV
      </button>
      <button type="button" onClick={onExportJSON} className={cls}>
        Exportar JSON
      </button>
      <button
        type="button"
        className={cls}
        onClick={async () => {
          try {
            await onCopy();
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
          } catch {
            setCopiado(false);
          }
        }}
      >
        {copiado ? "Copiado!" : "Copiar resultado"}
      </button>
      <button type="button" onClick={() => window.print()} className={cls}>
        Imprimir
      </button>
      <span aria-live="polite" className="sr-only">
        {copiado ? "Resultado copiado para a área de transferência" : ""}
      </span>
    </div>
  );
}
