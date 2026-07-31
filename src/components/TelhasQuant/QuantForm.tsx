import {
  LAYOUT_DICA,
  LAYOUT_LABEL,
  PRESETS,
  TIPO_LABEL,
  defaultLossPct,
  areaPiece_mm,
  type Layout,
  type TipoPeca,
} from "@/lib/telhas/calc";

export type QuantFormState = {
  preset: string;
  tipo: TipoPeca;
  larguraMm: number;
  alturaMm: number;
  areaM2: number;
  usarDimensoes: boolean;
  comprimentoM: number;
  larguraAmbienteM: number;
  layout: Layout;
  perdaManual: boolean;
  perdaPct: number;
  margemPct: number;
  juntaMm: number;
  pecasReserva: number;
};

export const DEFAULT_QUANT_FORM: QuantFormState = {
  preset: "piso-20x20",
  tipo: "piso-ceramico",
  larguraMm: 200,
  alturaMm: 200,
  areaM2: 12,
  usarDimensoes: false,
  comprimentoM: 4,
  larguraAmbienteM: 3,
  layout: "alinhado",
  perdaManual: false,
  perdaPct: 8,
  margemPct: 5,
  juntaMm: 3,
  pecasReserva: 5,
};

const LAYOUTS: Layout[] = ["alinhado", "desloc50", "desloc33", "herringbone", "livre"];
const TIPOS: TipoPeca[] = [
  "telha",
  "piso-ceramico",
  "porcelanato",
  "revestimento-parede",
  "placa-grande",
  "livre",
];

const inputCls =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

export function QuantForm({
  state,
  setState,
  onCalculate,
  onReset,
}: {
  state: QuantFormState;
  setState: (s: QuantFormState) => void;
  onCalculate: () => void;
  onReset: () => void;
}) {
  const set = <K extends keyof QuantFormState>(k: K, v: QuantFormState[K]) =>
    setState({ ...state, [k]: v });

  const perdaSugerida = defaultLossPct(
    state.tipo,
    state.layout,
    areaPiece_mm(state.larguraMm, state.alturaMm),
  );

  const aplicarPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) {
      set("preset", id);
      return;
    }
    setState({
      ...state,
      preset: id,
      tipo: p.tipo,
      larguraMm: p.larguraMm,
      alturaMm: p.alturaMm,
    });
  };

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
    >
      <div>
        <label htmlFor="area" className="block text-sm font-semibold text-foreground">
          Área a cobrir (m²)
        </label>
        <input
          id="area"
          type="number"
          min="0.1"
          step="0.01"
          required
          value={state.areaM2}
          onChange={(e) => set("areaM2", Number(e.target.value))}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-3 text-lg font-semibold outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Para telhados, use a área real inclinada da cobertura.
        </p>
      </div>

      <div>
        <label htmlFor="preset" className="block text-sm font-medium text-foreground">
          Preset de peça
        </label>
        <select
          id="preset"
          value={state.preset}
          onChange={(e) => aplicarPreset(e.target.value)}
          className={inputCls}
        >
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
          <option value="custom">Dimensão personalizada</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-foreground">
            Tipo de peça
          </label>
          <select
            id="tipo"
            value={state.tipo}
            onChange={(e) => set("tipo", e.target.value as TipoPeca)}
            className={inputCls}
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {TIPO_LABEL[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="larg" className="block text-sm font-medium text-foreground">
            Largura (mm)
          </label>
          <input
            id="larg"
            type="number"
            min="1"
            step="1"
            required
            value={state.larguraMm}
            onChange={(e) => setState({ ...state, larguraMm: Number(e.target.value), preset: "custom" })}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="alt" className="block text-sm font-medium text-foreground">
            Altura (mm)
          </label>
          <input
            id="alt"
            type="number"
            min="1"
            step="1"
            required
            value={state.alturaMm}
            onChange={(e) => setState({ ...state, alturaMm: Number(e.target.value), preset: "custom" })}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label htmlFor="layout" className="block text-sm font-medium text-foreground">
          Layout de assentamento
        </label>
        <select
          id="layout"
          value={state.layout}
          onChange={(e) => set("layout", e.target.value as Layout)}
          className={inputCls}
          aria-describedby="layout-dica"
        >
          {LAYOUTS.map((l) => (
            <option key={l} value={l}>
              {LAYOUT_LABEL[l]}
            </option>
          ))}
        </select>
        <p id="layout-dica" className="mt-1 text-xs text-muted-foreground">
          {LAYOUT_DICA[state.layout]}
        </p>
      </div>

      <fieldset className="rounded-md border border-border p-4">
        <legend className="px-1 text-sm font-medium text-foreground">
          Dimensões do ambiente (opcional)
        </legend>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={state.usarDimensoes}
            onChange={(e) => set("usarDimensoes", e.target.checked)}
          />
          Informar comprimento e largura para estimar cortes pelas bordas
        </label>
        {state.usarDimensoes && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="comp" className="block text-sm font-medium text-foreground">
                Comprimento (m)
              </label>
              <input
                id="comp"
                type="number"
                min="0.1"
                step="0.01"
                value={state.comprimentoM}
                onChange={(e) => set("comprimentoM", Number(e.target.value))}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="largamb" className="block text-sm font-medium text-foreground">
                Largura (m)
              </label>
              <input
                id="largamb"
                type="number"
                min="0.1"
                step="0.01"
                value={state.larguraAmbienteM}
                onChange={(e) => set("larguraAmbienteM", Number(e.target.value))}
                className={inputCls}
              />
            </div>
          </div>
        )}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="perda" className="block text-sm font-medium text-foreground">
            Perda por corte (%)
          </label>
          <input
            id="perda"
            type="number"
            min="0"
            max="60"
            step="0.5"
            value={state.perdaManual ? state.perdaPct : perdaSugerida}
            disabled={!state.perdaManual}
            onChange={(e) => set("perdaPct", Number(e.target.value))}
            className={`${inputCls} disabled:opacity-60`}
          />
          <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={state.perdaManual}
              onChange={(e) =>
                setState({ ...state, perdaManual: e.target.checked, perdaPct: perdaSugerida })
              }
            />
            Editar manualmente (sugerido: {perdaSugerida}%)
          </label>
        </div>
        <div>
          <label htmlFor="margem" className="block text-sm font-medium text-foreground">
            Margem de segurança (%)
          </label>
          <input
            id="margem"
            type="number"
            min="0"
            max="30"
            step="1"
            value={state.margemPct}
            onChange={(e) => set("margemPct", Number(e.target.value))}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="junta" className="block text-sm font-medium text-foreground">
            Espessura da junta (mm)
          </label>
          <input
            id="junta"
            type="number"
            min="0"
            max="20"
            step="0.5"
            value={state.juntaMm}
            onChange={(e) => set("juntaMm", Number(e.target.value))}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="reserva" className="block text-sm font-medium text-foreground">
            Peças de reserva (un)
          </label>
          <input
            id="reserva"
            type="number"
            min="0"
            step="1"
            value={state.pecasReserva}
            onChange={(e) => set("pecasReserva", Number(e.target.value))}
            className={inputCls}
          />
        </div>
      </div>

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
