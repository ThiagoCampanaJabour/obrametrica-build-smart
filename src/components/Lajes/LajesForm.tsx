import { DEFAULTS, type LajeApoio, type LajePainelInput, type LajeTipo } from "@/lib/lajes/calc";

export type LajesMode = "estimativa" | "engenharia";

export type LajesFormState = {
  mode: LajesMode;
  paineis: LajePainelInput[];
  precoConcretoM3: number;
  precoAcoKg: number;
  precoFormaM2: number;
};

export const DEFAULT_PAINEL: LajePainelInput = {
  id: "P1",
  tipo: "macica",
  L: 4,
  W: 3,
  espessuraM: 0.12,
  gk: DEFAULTS.gk,
  qk: DEFAULTS.qk,
  apoio: "simples",
  fckMPa: DEFAULTS.fckMPa,
  fyMPa: DEFAULTS.fyMPa,
  coberturaMm: DEFAULTS.coberturaMm,
};

export const DEFAULT_FORM: LajesFormState = {
  mode: "estimativa",
  paineis: [DEFAULT_PAINEL],
  precoConcretoM3: DEFAULTS.precoConcretoM3,
  precoAcoKg: DEFAULTS.precoAcoKg,
  precoFormaM2: DEFAULTS.precoFormaM2,
};

function Num({
  id,
  label,
  value,
  onChange,
  unit,
  step = "0.01",
  min = "0",
}: {
  id: string;
  label: string;
  value: number | undefined;
  onChange: (n: number) => void;
  unit?: string;
  step?: string;
  min?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-foreground">
        {label}
      </label>
      <div className="mt-1 flex rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          value={value ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent px-2 py-1.5 text-sm outline-none"
        />
        {unit && (
          <span className="flex items-center border-l border-input px-2 text-xs text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function LajesForm({
  state,
  setState,
  onCalculate,
  onReset,
}: {
  state: LajesFormState;
  setState: (s: LajesFormState) => void;
  onCalculate: () => void;
  onReset: () => void;
}) {
  const setPainel = (i: number, patch: Partial<LajePainelInput>) => {
    const next = state.paineis.map((p, idx) => (idx === i ? { ...p, ...patch } : p));
    setState({ ...state, paineis: next });
  };
  const addPainel = () =>
    setState({
      ...state,
      paineis: [
        ...state.paineis,
        { ...DEFAULT_PAINEL, id: `P${state.paineis.length + 1}` },
      ],
    });
  const removePainel = (i: number) =>
    setState({
      ...state,
      paineis: state.paineis.filter((_, idx) => idx !== i),
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
      className="space-y-5"
    >
      <div>
        <span className="block text-sm font-medium text-foreground">Modo de cálculo</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["estimativa", "engenharia"] as LajesMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setState({ ...state, mode: m })}
              aria-pressed={state.mode === m}
              className={`rounded-md border px-3 py-2 text-sm font-medium ${
                state.mode === m
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-input bg-background text-foreground hover:bg-muted"
              }`}
            >
              {m === "estimativa" ? "Estimativa rápida" : "Engenharia detalhada"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {state.paineis.map((p, i) => (
          <div key={i} className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <input
                aria-label={`ID do painel ${i + 1}`}
                type="text"
                value={p.id ?? `P${i + 1}`}
                onChange={(e) => setPainel(i, { id: e.target.value })}
                className="rounded-md border border-input bg-background px-2 py-1 text-sm font-semibold text-foreground"
              />
              <div className="flex items-center gap-2">
                <select
                  aria-label="Tipo de laje"
                  value={p.tipo}
                  onChange={(e) => setPainel(i, { tipo: e.target.value as LajeTipo })}
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="macica">Maciça unidirecional</option>
                  <option value="nervurada">Nervurada simples</option>
                </select>
                {state.paineis.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePainel(i)}
                    className="rounded-md border border-input bg-background px-2 py-1 text-xs hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Remover painel ${p.id}`}
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Num
                id={`L-${i}`}
                label="Vão principal (L)"
                unit="m"
                step="0.1"
                value={p.L}
                onChange={(n) => setPainel(i, { L: n })}
              />
              <Num
                id={`W-${i}`}
                label="Largura (W)"
                unit="m"
                step="0.1"
                value={p.W}
                onChange={(n) => setPainel(i, { W: n })}
              />
              {p.tipo === "macica" ? (
                <Num
                  id={`t-${i}`}
                  label="Espessura"
                  unit="m"
                  step="0.01"
                  value={p.espessuraM}
                  onChange={(n) => setPainel(i, { espessuraM: n })}
                />
              ) : (
                <>
                  <Num
                    id={`tm-${i}`}
                    label="Espessura da mesa"
                    unit="m"
                    step="0.01"
                    value={p.espessuraMesaM ?? 0.05}
                    onChange={(n) => setPainel(i, { espessuraMesaM: n })}
                  />
                  <Num
                    id={`hn-${i}`}
                    label="Altura da nervura"
                    unit="m"
                    step="0.01"
                    value={p.alturaNervuraM ?? 0.2}
                    onChange={(n) => setPainel(i, { alturaNervuraM: n })}
                  />
                  <Num
                    id={`bw-${i}`}
                    label="Largura da nervura (bw)"
                    unit="m"
                    step="0.01"
                    value={p.larguraNervuraM ?? 0.1}
                    onChange={(n) => setPainel(i, { larguraNervuraM: n })}
                  />
                  <Num
                    id={`pitch-${i}`}
                    label="Passo entre nervuras"
                    unit="m"
                    step="0.05"
                    value={p.pitchNervuraM ?? 0.6}
                    onChange={(n) => setPainel(i, { pitchNervuraM: n })}
                  />
                </>
              )}
              <Num
                id={`gk-${i}`}
                label="Carga perm. adicional (gk)"
                unit="kN/m²"
                step="0.1"
                value={p.gk}
                onChange={(n) => setPainel(i, { gk: n })}
              />
              <Num
                id={`qk-${i}`}
                label="Carga acidental (qk)"
                unit="kN/m²"
                step="0.1"
                value={p.qk}
                onChange={(n) => setPainel(i, { qk: n })}
              />
            </div>

            {state.mode === "engenharia" && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={`apoio-${i}`} className="block text-xs font-medium">
                    Condição de apoio
                  </label>
                  <select
                    id={`apoio-${i}`}
                    value={p.apoio ?? "simples"}
                    onChange={(e) => setPainel(i, { apoio: e.target.value as LajeApoio })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                  >
                    <option value="simples">Simples (α = 1/8)</option>
                    <option value="continua">Contínua (α = 1/10)</option>
                  </select>
                </div>
                <Num
                  id={`fck-${i}`}
                  label="Fck"
                  unit="MPa"
                  step="5"
                  value={p.fckMPa}
                  onChange={(n) => setPainel(i, { fckMPa: n })}
                />
                <Num
                  id={`fy-${i}`}
                  label="Fy do aço"
                  unit="MPa"
                  step="10"
                  value={p.fyMPa}
                  onChange={(n) => setPainel(i, { fyMPa: n })}
                />
                <Num
                  id={`cob-${i}`}
                  label="Cobrimento"
                  unit="mm"
                  step="5"
                  value={p.coberturaMm}
                  onChange={(n) => setPainel(i, { coberturaMm: n })}
                />
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addPainel}
          className="w-full rounded-md border border-dashed border-input bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          + Adicionar painel
        </button>
      </div>

      <details className="rounded-md border border-border bg-muted/30 p-3">
        <summary className="cursor-pointer text-sm font-medium text-foreground">
          Custos unitários (opcional)
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Num
            id="preco-conc"
            label="Concreto"
            unit="R$/m³"
            step="1"
            value={state.precoConcretoM3}
            onChange={(n) => setState({ ...state, precoConcretoM3: n })}
          />
          <Num
            id="preco-aco"
            label="Aço"
            unit="R$/kg"
            step="0.1"
            value={state.precoAcoKg}
            onChange={(n) => setState({ ...state, precoAcoKg: n })}
          />
          <Num
            id="preco-forma"
            label="Forma"
            unit="R$/m²"
            step="1"
            value={state.precoFormaM2}
            onChange={(n) => setState({ ...state, precoFormaM2: n })}
          />
        </div>
      </details>

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
