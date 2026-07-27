import { useState } from "react";
import type { CalculatorsOutputs } from "@/lib/orcamento-etapas/aggregator";
import { availableCalculators } from "@/lib/orcamento-etapas/aggregator";

const EXAMPLE: CalculatorsOutputs = {
  tijolos: { quantidade: 1200, tipo: "9x19x19" },
  concreto: { volume: 3.5 },
  cimento: { sacos: 40 },
  areia: { m3: 2 },
  brita: { m3: 1.5 },
  aco: { kg: 180 },
  forma: { m2: 25 },
  telhas: { quantidade: 350 },
  piso: { caixas: 8 },
  tinta: { litros: 18 },
  argamassa: { sacos: 12 },
  reboco: { cimentoSacos: 6, areiaM3: 1.2 },
  rejunte: { kg: 4 },
};

export function OrcamentoForm({
  onLoad,
  descontoGlobal,
  onDescontoGlobal,
  impostos,
  onImpostos,
}: {
  onLoad: (data: CalculatorsOutputs) => void;
  descontoGlobal: number;
  onDescontoGlobal: (v: number) => void;
  impostos: number;
  onImpostos: (v: number) => void;
}) {
  const [rawJson, setRawJson] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(availableCalculators().map((k) => [k, true])),
  );

  const loadExample = () => {
    const filtered: CalculatorsOutputs = {};
    for (const [k, v] of Object.entries(EXAMPLE)) if (enabled[k]) filtered[k] = v;
    onLoad(filtered);
    setError(null);
  };

  const importJson = () => {
    try {
      const parsed = JSON.parse(rawJson);
      const data = (parsed?.input ?? parsed) as CalculatorsOutputs;
      const filtered: CalculatorsOutputs = {};
      for (const [k, v] of Object.entries(data)) if (enabled[k]) filtered[k] = v;
      onLoad(filtered);
      setError(null);
    } catch (e) {
      setError("JSON inválido. Verifique a formatação.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Calculadoras a agregar</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {availableCalculators().map((k) => (
            <label key={k} className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={enabled[k]}
                onChange={(e) => setEnabled((s) => ({ ...s, [k]: e.target.checked }))}
                className="h-4 w-4 rounded border-border"
              />
              <span className="capitalize">{k}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="descG" className="block text-sm font-medium text-foreground">
            Desconto global (%)
          </label>
          <input
            id="descG"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={descontoGlobal}
            onChange={(e) => onDescontoGlobal(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="imp" className="block text-sm font-medium text-foreground">
            Impostos/encargos (%)
          </label>
          <input
            id="imp"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={impostos}
            onChange={(e) => onImpostos(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={loadExample}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
        >
          Carregar exemplo
        </button>
      </div>

      <div>
        <label htmlFor="rawJson" className="block text-sm font-medium text-foreground">
          Importar JSON das calculadoras
        </label>
        <textarea
          id="rawJson"
          rows={6}
          value={rawJson}
          onChange={(e) => setRawJson(e.target.value)}
          placeholder='{"tijolos":{"quantidade":1200},"concreto":{"volume":3.5}}'
          className="mt-1 w-full rounded-lg border border-border bg-background p-3 font-mono text-xs"
        />
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        <button
          type="button"
          onClick={importJson}
          className="mt-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
        >
          Importar
        </button>
      </div>
    </div>
  );
}
