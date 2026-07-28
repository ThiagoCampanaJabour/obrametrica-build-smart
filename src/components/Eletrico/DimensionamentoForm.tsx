import { CARGA_PRESETS, type CircuitInput, type LoadType, type Phases } from "@/lib/eletrico/calc";

export type EletricoFormState = {
  circuitos: CircuitInput[];
};

export const DEFAULT_CIRCUITOS: CircuitInput[] = [
  { id: "C1", nome: "Iluminação geral", tipo: "iluminacao", potenciaW: 600, tensaoV: 127, phases: 1, comprimentoM: 15 },
  { id: "C2", nome: "Tomadas gerais", tipo: "tomadas_gerais", potenciaW: 2000, tensaoV: 127, phases: 1, comprimentoM: 15 },
  { id: "C3", nome: "Chuveiro", tipo: "chuveiro", potenciaW: 4500, tensaoV: 220, phases: 1, comprimentoM: 15 },
  { id: "C4", nome: "Ar-condicionado", tipo: "ar_condicionado", potenciaW: 1200, tensaoV: 220, phases: 1, comprimentoM: 12 },
];

export const DEFAULT_FORM: EletricoFormState = { circuitos: DEFAULT_CIRCUITOS };

const LOAD_TYPES: { value: LoadType; label: string }[] = [
  { value: "iluminacao", label: "Iluminação" },
  { value: "tomadas_gerais", label: "Tomadas gerais" },
  { value: "tomadas_motor", label: "Tomadas motor" },
  { value: "chuveiro", label: "Chuveiro" },
  { value: "ar_condicionado", label: "Ar-condicionado" },
  { value: "forno", label: "Forno" },
  { value: "microondas", label: "Microondas" },
  { value: "maquina_lavar", label: "Máquina de lavar" },
  { value: "bomba", label: "Bomba" },
  { value: "outros", label: "Outros" },
];

export function DimensionamentoForm({
  state,
  setState,
  onCalculate,
  onReset,
}: {
  state: EletricoFormState;
  setState: (s: EletricoFormState) => void;
  onCalculate: () => void;
  onReset: () => void;
}) {
  const setC = (i: number, patch: Partial<CircuitInput>) => {
    const next = state.circuitos.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    setState({ circuitos: next });
  };
  const add = () =>
    setState({
      circuitos: [
        ...state.circuitos,
        {
          id: `C${state.circuitos.length + 1}`,
          nome: "Novo circuito",
          tipo: "tomadas_gerais",
          potenciaW: 1000,
          tensaoV: 127,
          phases: 1,
          comprimentoM: 10,
        },
      ],
    });
  const remove = (i: number) => setState({ circuitos: state.circuitos.filter((_, idx) => idx !== i) });

  const loadPreset = (key: string) => {
    const p = CARGA_PRESETS[key];
    if (!p) return;
    setState({
      circuitos: [
        ...state.circuitos,
        { ...p, id: `C${state.circuitos.length + 1}` },
      ],
    });
  };

  const loadResidencial = () =>
    setState({
      circuitos: [
        { id: "C1", nome: "Iluminação", tipo: "iluminacao", potenciaW: 600, tensaoV: 127, phases: 1, comprimentoM: 15 },
        { id: "C2", nome: "Tomadas quartos", tipo: "tomadas_gerais", potenciaW: 1500, tensaoV: 127, phases: 1, comprimentoM: 15 },
        { id: "C3", nome: "Tomadas cozinha", tipo: "tomadas_gerais", potenciaW: 3600, tensaoV: 127, phases: 1, comprimentoM: 12 },
        { id: "C4", nome: "Chuveiro", tipo: "chuveiro", potenciaW: 5500, tensaoV: 220, phases: 1, comprimentoM: 15 },
        { id: "C5", nome: "AC quarto", tipo: "ar_condicionado", potenciaW: 1200, tensaoV: 220, phases: 1, comprimentoM: 12 },
      ],
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
      className="space-y-5"
    >
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={loadResidencial}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
        >
          Preset residencial
        </button>
        <select
          onChange={(e) => {
            if (e.target.value) {
              loadPreset(e.target.value);
              e.target.value = "";
            }
          }}
          className="rounded-md border border-input bg-background px-2 py-1.5 text-xs"
          defaultValue=""
          aria-label="Adicionar carga a partir de preset"
        >
          <option value="">+ Adicionar carga (preset)</option>
          {Object.entries(CARGA_PRESETS).map(([k, v]) => (
            <option key={k} value={k}>
              {v.descricao}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {state.circuitos.map((c, i) => (
          <div key={i} className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <input
                aria-label="Nome do circuito"
                type="text"
                value={c.nome}
                onChange={(e) => setC(i, { nome: e.target.value })}
                className="min-w-[10rem] flex-1 rounded-md border border-input bg-background px-2 py-1 text-sm font-semibold"
              />
              <select
                aria-label="Tipo de carga"
                value={c.tipo}
                onChange={(e) => setC(i, { tipo: e.target.value as LoadType })}
                className="rounded-md border border-input bg-background px-2 py-1 text-xs"
              >
                {LOAD_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {state.circuitos.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Remover ${c.nome}`}
                >
                  Remover
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Potência (W)">
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={c.potenciaW ?? ""}
                  onChange={(e) => setC(i, { potenciaW: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                />
              </Field>
              <Field label="Tensão (V)">
                <select
                  value={c.tensaoV}
                  onChange={(e) => setC(i, { tensaoV: Number(e.target.value) })}
                  className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                >
                  <option value={127}>127 V</option>
                  <option value={220}>220 V</option>
                  <option value={380}>380 V</option>
                </select>
              </Field>
              <Field label="Fases">
                <select
                  value={c.phases}
                  onChange={(e) => setC(i, { phases: Number(e.target.value) as Phases })}
                  className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                >
                  <option value={1}>Monofásico</option>
                  <option value={2}>Bifásico</option>
                  <option value={3}>Trifásico</option>
                </select>
              </Field>
              <Field label="Comprimento (m)">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={c.comprimentoM}
                  onChange={(e) => setC(i, { comprimentoM: Number(e.target.value) })}
                  className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                />
              </Field>
              <Field label="Fator simult. (0-1)">
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={c.fatorSimultaneidade ?? ""}
                  placeholder="auto"
                  onChange={(e) =>
                    setC(i, {
                      fatorSimultaneidade: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                />
              </Field>
              <Field label="Fator potência">
                <input
                  type="number"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={c.fatorPotencia ?? 1}
                  onChange={(e) => setC(i, { fatorPotencia: Number(e.target.value) })}
                  className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                />
              </Field>
              <Field label="Override disjuntor (A)">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={c.disjuntorOverrideA ?? ""}
                  placeholder="auto"
                  onChange={(e) =>
                    setC(i, { disjuntorOverrideA: e.target.value ? Number(e.target.value) : undefined })
                  }
                  className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                />
              </Field>
              <Field label="Override bitola (mm²)">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={c.bitolaOverrideMm2 ?? ""}
                  placeholder="auto"
                  onChange={(e) =>
                    setC(i, { bitolaOverrideMm2: e.target.value ? Number(e.target.value) : undefined })
                  }
                  className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                />
              </Field>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={add}
          className="w-full rounded-md border border-dashed border-input bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          + Adicionar circuito
        </button>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Calcular
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-input bg-background px-5 py-2 text-sm font-medium hover:bg-muted"
        >
          Limpar
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-foreground">
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  );
}
