import { useState } from "react";
import presetsData from "@/data/mao-obra-presets.json";
import type {
  Difficulty,
  LaborEtapa,
  LaborInput,
  LaborUnit,
  ProductivityPreset,
} from "@/lib/mao-obra/calc";

const PRESETS = presetsData.presets as ProductivityPreset[];
const DEFAULT_COST = presetsData.cost_per_hour_default_BRL;
const DEFAULT_SHIFT = presetsData.shift_hours_default;

const EXAMPLE: LaborInput[] = [
  {
    id: "ex-1",
    service: "Reboco interno",
    etapa: "Revestimento",
    quantity: 120,
    unidade: "m2",
    productivity_h_per_unit: 0.17,
    num_workers: 2,
    cost_per_hour: 25,
    difficulty: "normal",
    shift_hours: 8,
  },
  {
    id: "ex-2",
    service: "Alvenaria de blocos",
    etapa: "Alvenaria",
    quantity: 40,
    unidade: "m2",
    productivity_h_per_unit: 0.67,
    num_workers: 2,
    cost_per_hour: 25,
    difficulty: "normal",
    shift_hours: 8,
  },
  {
    id: "ex-3",
    service: "Pintura (2 demãos)",
    etapa: "Acabamento",
    quantity: 200,
    unidade: "m2",
    productivity_h_per_unit: 0.05,
    num_workers: 1,
    cost_per_hour: 25,
    difficulty: "normal",
    shift_hours: 8,
  },
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function MaoObraForm({
  onLoad,
  onAdd,
  costPerHour,
  onCostPerHour,
  shiftHours,
  onShiftHours,
}: {
  onLoad: (items: LaborInput[]) => void;
  onAdd: (item: LaborInput) => void;
  costPerHour: number;
  onCostPerHour: (v: number) => void;
  shiftHours: number;
  onShiftHours: (v: number) => void;
}) {
  const [presetId, setPresetId] = useState<string>(PRESETS[0].id);
  const [quantity, setQuantity] = useState<number>(100);
  const [workers, setWorkers] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [rawJson, setRawJson] = useState("");
  const [error, setError] = useState<string | null>(null);

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];

  const handleAdd = () => {
    onAdd({
      id: uid(),
      service: preset.service,
      etapa: preset.etapa,
      quantity: Math.max(0, quantity),
      unidade: preset.unidade,
      productivity_h_per_unit: preset.productivity_h_per_unit,
      num_workers: Math.max(1, workers),
      cost_per_hour: costPerHour,
      difficulty,
      shift_hours: shiftHours,
    });
  };

  const importJson = () => {
    try {
      const parsed = JSON.parse(rawJson);
      const raw = parsed?.input ?? parsed;
      const arr = Array.isArray(raw) ? raw : [raw];
      const items: LaborInput[] = arr.map((it: Record<string, unknown>) => {
        const service = String(it.service ?? "Item");
        const unit = String(it.unit ?? it.unidade ?? "m2") as LaborUnit;
        const p =
          PRESETS.find((pp) => pp.service.toLowerCase() === service.toLowerCase()) ??
          PRESETS.find((pp) => pp.unidade === unit) ??
          PRESETS[0];
        return {
          id: uid(),
          service,
          etapa: (it.etapa as LaborEtapa) ?? p.etapa,
          quantity: Number(it.quantity ?? it.quantidade ?? 0),
          unidade: unit,
          productivity_h_per_unit: Number(
            it.productivity_h_per_unit ?? p.productivity_h_per_unit,
          ),
          num_workers: Number(it.num_workers ?? 1),
          cost_per_hour: Number(it.cost_per_hour ?? costPerHour),
          difficulty: (it.difficulty as Difficulty) ?? "normal",
          shift_hours: Number(it.shift_hours ?? shiftHours),
        };
      });
      onLoad(items);
      setError(null);
    } catch {
      setError("JSON inválido. Verifique a formatação.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-foreground">
            Custo por hora (R$/h)
          </label>
          <input
            id="cost"
            type="number"
            min="0"
            step="0.5"
            value={costPerHour}
            onChange={(e) => onCostPerHour(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="shift" className="block text-sm font-medium text-foreground">
            Jornada (h/dia)
          </label>
          <input
            id="shift"
            type="number"
            min="1"
            max="24"
            step="0.5"
            value={shiftHours}
            onChange={(e) => onShiftHours(Number(e.target.value) || 8)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground">Adicionar serviço</h3>
        <div className="mt-3 grid gap-3">
          <div>
            <label htmlFor="preset" className="block text-xs font-medium text-foreground">
              Serviço (preset)
            </label>
            <select
              id="preset"
              value={presetId}
              onChange={(e) => setPresetId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.service} ({p.unidade}) — {p.productivity_h_per_unit} h/{p.unidade}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="qty" className="block text-xs font-medium text-foreground">
                Quantidade ({preset.unidade})
              </label>
              <input
                id="qty"
                type="number"
                min="0"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="workers" className="block text-xs font-medium text-foreground">
                Trabalhadores
              </label>
              <input
                id="workers"
                type="number"
                min="1"
                step="1"
                value={workers}
                onChange={(e) => setWorkers(Number(e.target.value) || 1)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="diff" className="block text-xs font-medium text-foreground">
                Dificuldade
              </label>
              <select
                id="diff"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="normal">Normal (×1,00)</option>
                <option value="dificil">Difícil (×1,10)</option>
                <option value="muito_dificil">Muito difícil (×1,25)</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
          >
            Adicionar item
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onLoad(EXAMPLE)}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
        >
          Carregar exemplo
        </button>
      </div>

      <div>
        <label htmlFor="rawJson" className="block text-sm font-medium text-foreground">
          Importar JSON de quantitativos
        </label>
        <textarea
          id="rawJson"
          rows={5}
          value={rawJson}
          onChange={(e) => setRawJson(e.target.value)}
          placeholder='[{"service":"Reboco interno","quantity":120,"unit":"m2"}]'
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

export { DEFAULT_COST, DEFAULT_SHIFT };
