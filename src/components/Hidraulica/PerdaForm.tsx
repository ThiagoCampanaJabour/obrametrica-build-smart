import type { Dispatch, SetStateAction } from "react";
import type { DUnit, QUnit } from "@/lib/hidraulica/calc";

export const MATERIAIS = [
  { id: "pvc", nome: "PVC / PVC-U", eps_mm: 0.0015, hazenC: 150 },
  { id: "pead", nome: "PEAD (HDPE)", eps_mm: 0.0015, hazenC: 150 },
  { id: "cobre", nome: "Cobre", eps_mm: 0.0015, hazenC: 140 },
  { id: "aco-liso", nome: "Aço comercial (liso)", eps_mm: 0.045, hazenC: 120 },
  { id: "aco-galv", nome: "Aço galvanizado", eps_mm: 0.15, hazenC: 120 },
  { id: "ferro-fundido", nome: "Ferro fundido", eps_mm: 0.26, hazenC: 120 },
  { id: "concreto", nome: "Concreto", eps_mm: 0.3, hazenC: 110 },
  { id: "personalizado", nome: "Personalizado", eps_mm: 0.05, hazenC: 130 },
] as const;

export const PECAS_PRESET = [
  { label: "Curva 90° raio longo", K: 0.6 },
  { label: "Curva 90° padrão", K: 0.9 },
  { label: "Curva 45°", K: 0.4 },
  { label: "Tê passagem direta", K: 0.6 },
  { label: "Tê saída lateral", K: 1.8 },
  { label: "Válvula gaveta aberta", K: 0.2 },
  { label: "Válvula esfera aberta", K: 0.1 },
  { label: "Válvula globo aberta", K: 10 },
  { label: "Válvula de retenção", K: 2.5 },
  { label: "Entrada de borda viva", K: 0.5 },
  { label: "Saída de tubulação", K: 1 },
] as const;

export type TrechoInput = {
  id: string;
  label: string;
  D: number;
  L: number;
  Q: number;
  material: string;
  eps_mm: number;
  hazenC: number;
};

export type PecaInput = {
  id: string;
  label: string;
  K: number;
  qty: number;
  trechoId: string;
};

export type PerdaFormState = {
  metodo: "darcy-colebrook" | "darcy-swamee-jain" | "hazen-williams";
  temperatura: number;
  unidadeQ: QUnit;
  unidadeD: DUnit;
  desnivel: number;
  eficiencia: number;
  trechos: TrechoInput[];
  pecas: PecaInput[];
};

const uid = () => Math.random().toString(36).slice(2, 9);

export function novoTrecho(index: number): TrechoInput {
  return {
    id: uid(),
    label: `Trecho ${String.fromCharCode(65 + index)}`,
    D: 50,
    L: 100,
    Q: 2,
    material: "pvc",
    eps_mm: 0.0015,
    hazenC: 150,
  };
}

export const DEFAULT_PERDA_FORM: PerdaFormState = {
  metodo: "darcy-colebrook",
  temperatura: 20,
  unidadeQ: "L/s",
  unidadeD: "mm",
  desnivel: 0,
  eficiencia: 0.6,
  trechos: [
    {
      id: "t1",
      label: "Trecho A",
      D: 50,
      L: 100,
      Q: 2,
      material: "pvc",
      eps_mm: 0.0015,
      hazenC: 150,
    },
  ],
  pecas: [],
};

const inputClass =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";
const labelClass = "block text-xs font-medium text-muted-foreground";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass} title={hint}>
        {label}
      </span>
      {children}
    </label>
  );
}

export function PerdaForm({
  state,
  setState,
  onCalculate,
  onReset,
}: {
  state: PerdaFormState;
  setState: Dispatch<SetStateAction<PerdaFormState>>;
  onCalculate: () => void;
  onReset: () => void;
}) {
  const set = <K extends keyof PerdaFormState>(key: K, value: PerdaFormState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const updateTrecho = (id: string, patch: Partial<TrechoInput>) =>
    setState((s) => ({
      ...s,
      trechos: s.trechos.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));

  const isHazen = state.metodo === "hazen-williams";

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
    >
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-foreground">Método e fluido</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Método de cálculo">
            <select
              className={inputClass}
              value={state.metodo}
              onChange={(e) => set("metodo", e.target.value as PerdaFormState["metodo"])}
            >
              <option value="darcy-colebrook">Darcy-Weisbach (Colebrook)</option>
              <option value="darcy-swamee-jain">Darcy-Weisbach (Swamee-Jain)</option>
              <option value="hazen-williams">Hazen-Williams</option>
            </select>
          </Field>
          <Field label="Temperatura da água (°C)" hint="Define ρ e μ do fluido">
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              className={inputClass}
              value={state.temperatura}
              onChange={(e) => set("temperatura", Number(e.target.value))}
            />
          </Field>
          <Field label="Unidade de vazão">
            <select
              className={inputClass}
              value={state.unidadeQ}
              onChange={(e) => set("unidadeQ", e.target.value as QUnit)}
            >
              <option value="L/s">L/s</option>
              <option value="m3/h">m³/h</option>
              <option value="m3/s">m³/s</option>
              <option value="gpm">gpm</option>
            </select>
          </Field>
          <Field label="Unidade de diâmetro">
            <select
              className={inputClass}
              value={state.unidadeD}
              onChange={(e) => set("unidadeD", e.target.value as DUnit)}
            >
              <option value="mm">mm</option>
              <option value="m">m</option>
              <option value="in">pol</option>
            </select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-foreground">Trechos</legend>
        {state.trechos.map((t, i) => (
          <div key={t.id} className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-2">
              <input
                aria-label={`Nome do trecho ${i + 1}`}
                className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring"
                value={t.label}
                onChange={(e) => updateTrecho(t.id, { label: e.target.value })}
              />
              {state.trechos.length > 1 && (
                <button
                  type="button"
                  className="shrink-0 rounded-md border border-input px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                  onClick={() =>
                    setState((s) => ({
                      ...s,
                      trechos: s.trechos.filter((x) => x.id !== t.id),
                      pecas: s.pecas.filter((p) => p.trechoId !== t.id),
                    }))
                  }
                >
                  Remover
                </button>
              )}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Field label={`Diâmetro interno (${state.unidadeD})`}>
                <input
                  type="number"
                  min={0}
                  step="any"
                  className={inputClass}
                  value={t.D}
                  onChange={(e) => updateTrecho(t.id, { D: Number(e.target.value) })}
                />
              </Field>
              <Field label="Comprimento (m)">
                <input
                  type="number"
                  min={0}
                  step="any"
                  className={inputClass}
                  value={t.L}
                  onChange={(e) => updateTrecho(t.id, { L: Number(e.target.value) })}
                />
              </Field>
              <Field label={`Vazão (${state.unidadeQ})`}>
                <input
                  type="number"
                  min={0}
                  step="any"
                  className={inputClass}
                  value={t.Q}
                  onChange={(e) => updateTrecho(t.id, { Q: Number(e.target.value) })}
                />
              </Field>
              <Field label="Material">
                <select
                  className={inputClass}
                  value={t.material}
                  onChange={(e) => {
                    const m = MATERIAIS.find((x) => x.id === e.target.value)!;
                    updateTrecho(t.id, {
                      material: m.id,
                      eps_mm: m.eps_mm,
                      hazenC: m.hazenC,
                    });
                  }}
                >
                  {MATERIAIS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </Field>
              {isHazen ? (
                <Field label="Coeficiente C (Hazen-Williams)">
                  <input
                    type="number"
                    min={50}
                    max={160}
                    step="any"
                    className={inputClass}
                    value={t.hazenC}
                    onChange={(e) => updateTrecho(t.id, { hazenC: Number(e.target.value) })}
                  />
                </Field>
              ) : (
                <Field label="Rugosidade ε (mm)">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={inputClass}
                    value={t.eps_mm}
                    onChange={(e) => updateTrecho(t.id, { eps_mm: Number(e.target.value) })}
                  />
                </Field>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          onClick={() =>
            setState((s) => ({ ...s, trechos: [...s.trechos, novoTrecho(s.trechos.length)] }))
          }
        >
          + Adicionar trecho
        </button>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-foreground">
          Perdas localizadas (peças)
        </legend>
        {state.pecas.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Nenhuma peça adicionada. Curvas, tês e válvulas podem representar de 20% a 50% da perda
            total em ramais curtos.
          </p>
        )}
        {state.pecas.map((p) => (
          <div key={p.id} className="grid gap-2 sm:grid-cols-[1fr_80px_70px_auto]">
            <select
              aria-label="Peça"
              className={inputClass}
              value={p.label}
              onChange={(e) => {
                const preset = PECAS_PRESET.find((x) => x.label === e.target.value);
                setState((s) => ({
                  ...s,
                  pecas: s.pecas.map((x) =>
                    x.id === p.id
                      ? { ...x, label: e.target.value, K: preset ? preset.K : x.K }
                      : x,
                  ),
                }));
              }}
            >
              {PECAS_PRESET.map((x) => (
                <option key={x.label} value={x.label}>
                  {x.label}
                </option>
              ))}
            </select>
            <input
              aria-label="Coeficiente K"
              type="number"
              step="any"
              min={0}
              className={inputClass}
              value={p.K}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  pecas: s.pecas.map((x) =>
                    x.id === p.id ? { ...x, K: Number(e.target.value) } : x,
                  ),
                }))
              }
            />
            <input
              aria-label="Quantidade"
              type="number"
              min={1}
              step={1}
              className={inputClass}
              value={p.qty}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  pecas: s.pecas.map((x) =>
                    x.id === p.id ? { ...x, qty: Number(e.target.value) } : x,
                  ),
                }))
              }
            />
            <div className="flex gap-2">
              <select
                aria-label="Trecho da peça"
                className={inputClass}
                value={p.trechoId}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    pecas: s.pecas.map((x) =>
                      x.id === p.id ? { ...x, trechoId: e.target.value } : x,
                    ),
                  }))
                }
              >
                {state.trechos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                aria-label="Remover peça"
                className="mt-1 shrink-0 rounded-md border border-input px-2 text-xs text-muted-foreground hover:bg-muted"
                onClick={() =>
                  setState((s) => ({ ...s, pecas: s.pecas.filter((x) => x.id !== p.id) }))
                }
              >
                ×
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          onClick={() =>
            setState((s) => ({
              ...s,
              pecas: [
                ...s.pecas,
                {
                  id: uid(),
                  label: PECAS_PRESET[1]!.label,
                  K: PECAS_PRESET[1]!.K,
                  qty: 1,
                  trechoId: s.trechos[0]!.id,
                },
              ],
            }))
          }
        >
          + Adicionar peça
        </button>
      </fieldset>

      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="text-sm font-semibold text-foreground">Bomba e cota</legend>
        <Field label="Desnível geométrico Δz (m)" hint="Positivo em recalque">
          <input
            type="number"
            step="any"
            className={inputClass}
            value={state.desnivel}
            onChange={(e) => set("desnivel", Number(e.target.value))}
          />
        </Field>
        <Field label="Rendimento do conjunto motobomba η">
          <input
            type="number"
            min={0.05}
            max={1}
            step={0.05}
            className={inputClass}
            value={state.eficiencia}
            onChange={(e) => set("eficiencia", Number(e.target.value))}
          />
        </Field>
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Calcular
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-input bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Limpar
        </button>
      </div>
    </form>
  );
}
