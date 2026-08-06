import { useMemo } from "react";
import {
  CITY_PRESETS,
  MODULE_PRESETS,
  PR_PRESETS,
} from "@/lib/solar/kwkwh-presets";
import { factorFromHEandPR, adjustFactorForTiltOrientation } from "@/lib/solar/kwkwh";

export type ConverterMode = "kwp-to-kwh" | "kwh-to-kwp";

export interface KwKwhFormState {
  modo: ConverterMode;
  /** kWp no modo direto; kWh/ano no modo inverso. */
  valor: number;
  cidadeId: string;
  /** Fator manual (kWh/kWp/ano) quando fonteFator = "manual". */
  fator: number;
  fonteFator: "preset" | "manual" | "he-pr";
  he_ano: number;
  pr_he: number;
  losses_pct: number;
  tilt_deg: number;
  azimuth_deg: number;
  ajustarPorTilt: boolean;
  modulo_W: number;
  spare_pct: number;
}

export const DEFAULT_FORM: KwKwhFormState = {
  modo: "kwp-to-kwh",
  valor: 5,
  cidadeId: "sp",
  fator: 1500,
  fonteFator: "preset",
  he_ano: 1745,
  pr_he: 0.78,
  losses_pct: 14,
  tilt_deg: 20,
  azimuth_deg: 0,
  ajustarPorTilt: false,
  modulo_W: 550,
  spare_pct: 3,
};

/** Fator de produção efetivo derivado do estado do formulário. */
export function resolveFactor(state: KwKwhFormState): number {
  const cidade = CITY_PRESETS.find((c) => c.id === state.cidadeId) ?? CITY_PRESETS[0]!;
  let base: number;
  if (state.fonteFator === "manual") base = state.fator;
  else if (state.fonteFator === "he-pr") base = factorFromHEandPR(state.he_ano, state.pr_he);
  else base = cidade.fator_default;

  if (!state.ajustarPorTilt) return base;
  return adjustFactorForTiltOrientation(base, state.tilt_deg, state.azimuth_deg, cidade.latitude);
}

const fieldClass =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";
const labelClass = "block text-sm font-medium text-foreground";

export interface KwKwhFormProps {
  state: KwKwhFormState;
  onChange: (next: KwKwhFormState) => void;
}

export function KwKwhForm({ state, onChange }: KwKwhFormProps) {
  const set = <K extends keyof KwKwhFormState>(key: K, value: KwKwhFormState[K]) =>
    onChange({ ...state, [key]: value });

  const cidade = useMemo(
    () => CITY_PRESETS.find((c) => c.id === state.cidadeId) ?? CITY_PRESETS[0]!,
    [state.cidadeId],
  );

  const fatorEfetivo = useMemo(() => resolveFactor(state), [state]);

  const isDireto = state.modo === "kwp-to-kwh";

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <fieldset>
        <legend className="text-sm font-medium text-foreground">Direção da conversão</legend>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {(
            [
              { id: "kwp-to-kwh", label: "kWp → kWh/ano" },
              { id: "kwh-to-kwp", label: "kWh/ano → kWp" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              aria-pressed={state.modo === opt.id}
              onClick={() => set("modo", opt.id)}
              className={
                state.modo === opt.id
                  ? "rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-semibold text-foreground"
                  : "rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-accent"
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="valor" className={labelClass}>
            {isDireto ? "Potência instalada (kWp)" : "Meta de geração (kWh/ano)"}
          </label>
          <input
            id="valor"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            value={Number.isFinite(state.valor) ? state.valor : ""}
            onChange={(e) => set("valor", Number(e.target.value))}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="cidade" className={labelClass}>
            Cidade de referência
          </label>
          <select
            id="cidade"
            value={state.cidadeId}
            onChange={(e) => {
              const next = CITY_PRESETS.find((c) => c.id === e.target.value);
              onChange({
                ...state,
                cidadeId: e.target.value,
                fator: next?.fator_default ?? state.fator,
                he_ano: next?.he_ano ?? state.he_ano,
              });
            }}
            className={fieldClass}
          >
            {CITY_PRESETS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.cidade} ({c.uf}) — {c.fator_default} kWh/kWp/ano
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <span className={labelClass}>Origem do fator de produção</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              { id: "preset", label: "Preset da cidade" },
              { id: "manual", label: "Fator manual" },
              { id: "he-pr", label: "HE × PR" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              aria-pressed={state.fonteFator === opt.id}
              onClick={() => set("fonteFator", opt.id)}
              className={
                state.fonteFator === opt.id
                  ? "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-semibold text-foreground"
                  : "rounded-md border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent"
              }
            >
              {opt.label}
            </button>
          ))}
        </div>

        {state.fonteFator === "manual" && (
          <div className="mt-3">
            <label htmlFor="fator" className={labelClass}>
              Fator de produção (kWh/kWp/ano)
            </label>
            <input
              id="fator"
              type="number"
              min="0"
              step="any"
              value={Number.isFinite(state.fator) ? state.fator : ""}
              onChange={(e) => set("fator", Number(e.target.value))}
              className={fieldClass}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Faixa típica em {cidade.cidade}: {cidade.fator_min}–{cidade.fator_max} kWh/kWp/ano.
            </p>
          </div>
        )}

        {state.fonteFator === "he-pr" && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="he" className={labelClass}>
                Horas equivalentes (h/ano)
              </label>
              <input
                id="he"
                type="number"
                min="0"
                step="any"
                value={Number.isFinite(state.he_ano) ? state.he_ano : ""}
                onChange={(e) => set("he_ano", Number(e.target.value))}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="prhe" className={labelClass}>
                Performance Ratio (0–1)
              </label>
              <input
                id="prhe"
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={Number.isFinite(state.pr_he) ? state.pr_he : ""}
                onChange={(e) => set("pr_he", Number(e.target.value))}
                className={fieldClass}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="perdas" className={labelClass}>
            Perdas sistêmicas: {state.losses_pct}% (PR ={" "}
            {((1 - state.losses_pct / 100) || 0).toFixed(2)})
          </label>
          <input
            id="perdas"
            type="range"
            min="0"
            max="40"
            step="1"
            value={state.losses_pct}
            onChange={(e) => set("losses_pct", Number(e.target.value))}
            className="mt-2 w-full accent-[hsl(var(--accent))]"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {PR_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                title={p.descricao}
                onClick={() => set("losses_pct", p.losses_pct)}
                className="rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-accent"
              >
                {p.label} ({p.losses_pct}%)
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="modulo" className={labelClass}>
            Módulo de referência
          </label>
          <select
            id="modulo"
            value={state.modulo_W}
            onChange={(e) => set("modulo_W", Number(e.target.value))}
            className={fieldClass}
          >
            {MODULE_PRESETS.map((m) => (
              <option key={m.id} value={m.potencia_W}>
                {m.label}
              </option>
            ))}
          </select>
          {!isDireto && (
            <div className="mt-3">
              <label htmlFor="spare" className={labelClass}>
                Margem de reserva (%)
              </label>
              <input
                id="spare"
                type="number"
                min="0"
                max="20"
                step="1"
                value={Number.isFinite(state.spare_pct) ? state.spare_pct : ""}
                onChange={(e) => set("spare_pct", Number(e.target.value))}
                className={fieldClass}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={state.ajustarPorTilt}
            onChange={(e) => set("ajustarPorTilt", e.target.checked)}
            className="h-4 w-4 accent-[hsl(var(--accent))]"
          />
          Ajustar o fator por inclinação e orientação (estimativa aproximada)
        </label>

        {state.ajustarPorTilt && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="tilt" className={labelClass}>
                Inclinação (°)
              </label>
              <input
                id="tilt"
                type="number"
                min="0"
                max="90"
                step="1"
                value={Number.isFinite(state.tilt_deg) ? state.tilt_deg : ""}
                onChange={(e) => set("tilt_deg", Number(e.target.value))}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="azimute" className={labelClass}>
                Azimute (° — 0 = Norte)
              </label>
              <input
                id="azimute"
                type="number"
                min="0"
                max="360"
                step="5"
                value={Number.isFinite(state.azimuth_deg) ? state.azimuth_deg : ""}
                onChange={(e) => set("azimuth_deg", Number(e.target.value))}
                className={fieldClass}
              />
            </div>
          </div>
        )}

        <p className="mt-3 text-xs text-muted-foreground">
          Fator efetivo aplicado:{" "}
          <strong className="text-foreground">
            {fatorEfetivo.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} kWh/kWp/ano
          </strong>
        </p>
      </div>
    </div>
  );
}
