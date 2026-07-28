import { DEFAULTS, SOIL_CAPACITY_KN_M2, type SoilPreset } from "@/lib/fundacao/calc";

export type FundacaoTipo = "isolada" | "corrida";

export type FormState = {
  tipo: FundacaoTipo;
  cargaPorPilarKN: number;
  numPilares: number;
  cargaLinearKNm: number;
  comprimentoTotalM: number;
  soloPreset: SoilPreset;
  capacidadeSoloKNm2: number;
  safetyFactor: number;
  kgAcoPorM3: number;
  fckMPa: number;
  coberturaMm: number;
  precoConcretoM3: number;
  precoAcoKg: number;
  precoFormaM2: number;
};

export const DEFAULT_FORM: FormState = {
  tipo: "isolada",
  cargaPorPilarKN: 300,
  numPilares: 8,
  cargaLinearKNm: 40,
  comprimentoTotalM: 30,
  soloPreset: "medio",
  capacidadeSoloKNm2: SOIL_CAPACITY_KN_M2.medio,
  safetyFactor: DEFAULTS.safetyFactor,
  kgAcoPorM3: DEFAULTS.kgAcoPorM3,
  fckMPa: DEFAULTS.fckMPa,
  coberturaMm: DEFAULTS.coberturaMm,
  precoConcretoM3: DEFAULTS.precoConcretoM3,
  precoAcoKg: DEFAULTS.precoAcoKg,
  precoFormaM2: DEFAULTS.precoFormaM2,
};

const PRESETS: Array<{ id: string; label: string; patch: Partial<FormState> }> = [
  {
    id: "residencial",
    label: "Residencial leve",
    patch: {
      cargaPorPilarKN: 200,
      cargaLinearKNm: 30,
      soloPreset: "medio",
      capacidadeSoloKNm2: SOIL_CAPACITY_KN_M2.medio,
    },
  },
  {
    id: "medio",
    label: "Edificação média",
    patch: {
      cargaPorPilarKN: 500,
      cargaLinearKNm: 60,
      soloPreset: "firme",
      capacidadeSoloKNm2: SOIL_CAPACITY_KN_M2.firme,
    },
  },
  {
    id: "industrial",
    label: "Industrial leve",
    patch: {
      cargaPorPilarKN: 900,
      cargaLinearKNm: 90,
      soloPreset: "firme",
      capacidadeSoloKNm2: SOIL_CAPACITY_KN_M2.firme,
    },
  },
];

function Field({
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
  value: number;
  onChange: (n: number) => void;
  unit?: string;
  step?: string;
  min?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="mt-1 flex rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent px-3 py-2 text-sm outline-none"
        />
        {unit && (
          <span className="flex items-center border-l border-input px-3 text-sm text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function FundacaoForm({
  form,
  setForm,
  onCalculate,
  onReset,
}: {
  form: FormState;
  setForm: (patch: Partial<FormState>) => void;
  onCalculate: () => void;
  onReset: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
      className="space-y-5"
    >
      <div>
        <label className="block text-sm font-medium text-foreground">Tipo de fundação</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["isolada", "corrida"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm({ tipo: t })}
              aria-pressed={form.tipo === t}
              className={`rounded-md border px-3 py-2 text-sm font-medium ${
                form.tipo === t
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-input bg-background text-foreground hover:bg-muted"
              }`}
            >
              {t === "isolada" ? "Sapata isolada" : "Sapata corrida"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Presets rápidos</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setForm(p.patch)}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {form.tipo === "isolada" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="carga-pilar"
            label="Carga por pilar"
            unit="kN"
            step="1"
            value={form.cargaPorPilarKN}
            onChange={(n) => setForm({ cargaPorPilarKN: n })}
          />
          <Field
            id="num-pilares"
            label="Número de pilares"
            unit="un"
            step="1"
            min="1"
            value={form.numPilares}
            onChange={(n) => setForm({ numPilares: Math.max(1, Math.round(n)) })}
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="carga-linear"
            label="Carga linear"
            unit="kN/m"
            step="0.5"
            value={form.cargaLinearKNm}
            onChange={(n) => setForm({ cargaLinearKNm: n })}
          />
          <Field
            id="compr-total"
            label="Comprimento total"
            unit="m"
            step="0.1"
            value={form.comprimentoTotalM}
            onChange={(n) => setForm({ comprimentoTotalM: n })}
          />
        </div>
      )}

      <div>
        <label htmlFor="solo-preset" className="block text-sm font-medium text-foreground">
          Tipo de solo (preset)
        </label>
        <select
          id="solo-preset"
          value={form.soloPreset}
          onChange={(e) => {
            const p = e.target.value as SoilPreset;
            setForm({
              soloPreset: p,
              capacidadeSoloKNm2:
                p === "custom" ? form.capacidadeSoloKNm2 : SOIL_CAPACITY_KN_M2[p],
            });
          }}
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="macio">Macio (~100 kN/m²)</option>
          <option value="medio">Médio (~200 kN/m²)</option>
          <option value="firme">Firme (~300 kN/m²)</option>
          <option value="custom">Personalizado</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="cap-solo"
          label="Capacidade admissível do solo"
          unit="kN/m²"
          step="1"
          value={form.capacidadeSoloKNm2}
          onChange={(n) => setForm({ capacidadeSoloKNm2: n, soloPreset: "custom" })}
        />
        <Field
          id="fs"
          label="Fator de segurança"
          unit="×"
          step="0.1"
          value={form.safetyFactor}
          onChange={(n) => setForm({ safetyFactor: n })}
        />
        <Field
          id="kg-aco"
          label="Aço por m³ de concreto"
          unit="kg/m³"
          step="5"
          value={form.kgAcoPorM3}
          onChange={(n) => setForm({ kgAcoPorM3: n })}
        />
        <Field
          id="fck"
          label="Fck do concreto"
          unit="MPa"
          step="5"
          value={form.fckMPa}
          onChange={(n) => setForm({ fckMPa: n })}
        />
      </div>

      <details className="rounded-md border border-border bg-muted/30 p-3">
        <summary className="cursor-pointer text-sm font-medium text-foreground">
          Custos unitários (opcional)
        </summary>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Field
            id="preco-concreto"
            label="Concreto"
            unit="R$/m³"
            step="1"
            value={form.precoConcretoM3}
            onChange={(n) => setForm({ precoConcretoM3: n })}
          />
          <Field
            id="preco-aco"
            label="Aço"
            unit="R$/kg"
            step="0.1"
            value={form.precoAcoKg}
            onChange={(n) => setForm({ precoAcoKg: n })}
          />
          <Field
            id="preco-forma"
            label="Forma"
            unit="R$/m²"
            step="1"
            value={form.precoFormaM2}
            onChange={(n) => setForm({ precoFormaM2: n })}
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
