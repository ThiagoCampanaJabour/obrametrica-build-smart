import {
  COEF_ESCOAMENTO,
  DURACOES_MIN,
  INTENSIDADES,
  MATERIAL_LABEL,
  SUPERFICIE_LABEL,
  getIntensidade,
  type Bacia,
  type MaterialConduto,
  type SuperficieTipo,
} from "@/lib/drenagem/calc";

export type DrenagemFormState = {
  bacias: Bacia[];
  cidade: string;
  duracaoMin: number;
  intensidadeMmH: number;
  usarPreset: boolean;
  fatorSeguranca: number;
  material: MaterialConduto;
  declividadePct: number;
  diametroMinimoMm: number;
  formaCalha: "retangular" | "semicircular";
  velocidadeProjetoMs: number;
  capacidadeRaloLs: number;
};

export const DEFAULT_DRENAGEM_FORM: DrenagemFormState = {
  bacias: [
    { nome: "Telhado norte", areaM2: 100, superficie: "telha", destino: "Ponto único" },
  ],
  cidade: "São Paulo",
  duracaoMin: 15,
  intensidadeMmH: 130,
  usarPreset: true,
  fatorSeguranca: 1,
  material: "pvc",
  declividadePct: 1,
  diametroMinimoMm: 100,
  formaCalha: "retangular",
  velocidadeProjetoMs: 1,
  capacidadeRaloLs: 1.5,
};

const inputCls =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
const labelCls = "block text-xs font-medium text-muted-foreground";

export function DrenagemForm({
  state,
  setState,
  onCalculate,
  onReset,
}: {
  state: DrenagemFormState;
  setState: (s: DrenagemFormState) => void;
  onCalculate: () => void;
  onReset: () => void;
}) {
  const patch = (p: Partial<DrenagemFormState>) => setState({ ...state, ...p });

  const setBacia = (i: number, p: Partial<Bacia>) => {
    const bacias = state.bacias.map((b, idx) => (idx === i ? { ...b, ...p } : b));
    patch({ bacias });
  };

  const aplicarPreset = (cidade: string, duracaoMin: number) => {
    const i = getIntensidade(cidade, duracaoMin);
    patch({ cidade, duracaoMin, intensidadeMmH: i ?? state.intensidadeMmH, usarPreset: true });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
      className="space-y-6"
    >
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-foreground">
          Bacias / áreas de contribuição
        </legend>

        {state.bacias.map((b, i) => (
          <div key={i} className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Bacia {i + 1}
              </span>
              {state.bacias.length > 1 && (
                <button
                  type="button"
                  onClick={() => patch({ bacias: state.bacias.filter((_, idx) => idx !== i) })}
                  className="text-xs font-medium text-destructive hover:underline"
                >
                  Remover
                </button>
              )}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor={`nome-${i}`}>
                  Nome / ID
                </label>
                <input
                  id={`nome-${i}`}
                  className={inputCls}
                  value={b.nome}
                  onChange={(e) => setBacia(i, { nome: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor={`area-${i}`}>
                  Área (m²)
                </label>
                <input
                  id={`area-${i}`}
                  type="number"
                  min="0"
                  step="0.1"
                  className={inputCls}
                  value={b.areaM2}
                  onChange={(e) => setBacia(i, { areaM2: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor={`sup-${i}`}>
                  Superfície
                </label>
                <select
                  id={`sup-${i}`}
                  className={inputCls}
                  value={b.superficie}
                  onChange={(e) => {
                    const s = e.target.value as SuperficieTipo;
                    setBacia(i, { superficie: s, C: COEF_ESCOAMENTO[s] });
                  }}
                >
                  {Object.entries(SUPERFICIE_LABEL).map(([v, label]) => (
                    <option key={v} value={v}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor={`c-${i}`}>
                  Coeficiente C
                </label>
                <input
                  id={`c-${i}`}
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  className={inputCls}
                  value={b.C ?? COEF_ESCOAMENTO[b.superficie]}
                  onChange={(e) => setBacia(i, { C: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor={`incl-${i}`}>
                  Inclinação média (%) — opcional
                </label>
                <input
                  id={`incl-${i}`}
                  type="number"
                  min="0"
                  step="0.1"
                  className={inputCls}
                  value={b.inclinacaoPct ?? ""}
                  onChange={(e) =>
                    setBacia(i, {
                      inclinacaoPct: e.target.value === "" ? undefined : Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className={labelCls} htmlFor={`dest-${i}`}>
                  Ponto de despejo
                </label>
                <input
                  id={`dest-${i}`}
                  className={inputCls}
                  placeholder="Ponto único"
                  value={b.destino ?? ""}
                  onChange={(e) => setBacia(i, { destino: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            patch({
              bacias: [
                ...state.bacias,
                {
                  nome: `Bacia ${state.bacias.length + 1}`,
                  areaM2: 50,
                  superficie: "laje",
                  destino: "Ponto único",
                },
              ],
            })
          }
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          + Adicionar bacia
        </button>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-foreground">Parâmetros de projeto</legend>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="cidade">
              Cidade (preset de chuva)
            </label>
            <select
              id="cidade"
              className={inputCls}
              value={state.cidade}
              onChange={(e) => aplicarPreset(e.target.value, state.duracaoMin)}
            >
              {Object.keys(INTENSIDADES).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="duracao">
              Duração de projeto (min)
            </label>
            <select
              id="duracao"
              className={inputCls}
              value={state.duracaoMin}
              onChange={(e) => aplicarPreset(state.cidade, Number(e.target.value))}
            >
              {DURACOES_MIN.map((d) => (
                <option key={d} value={d}>
                  {d} min
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="i">
              Intensidade de chuva i (mm/h)
            </label>
            <input
              id="i"
              type="number"
              min="0"
              step="1"
              className={inputCls}
              value={state.intensidadeMmH}
              onChange={(e) =>
                patch({ intensidadeMmH: Number(e.target.value), usarPreset: false })
              }
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="fs">
              Fator de segurança
            </label>
            <input
              id="fs"
              type="number"
              min="1"
              step="0.05"
              className={inputCls}
              value={state.fatorSeguranca}
              onChange={(e) => patch({ fatorSeguranca: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="material">
              Material do conduto
            </label>
            <select
              id="material"
              className={inputCls}
              value={state.material}
              onChange={(e) => patch({ material: e.target.value as MaterialConduto })}
            >
              {Object.entries(MATERIAL_LABEL).map(([v, label]) => (
                <option key={v} value={v}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="s">
              Declividade do trecho (%)
            </label>
            <input
              id="s"
              type="number"
              min="0.1"
              step="0.1"
              className={inputCls}
              value={state.declividadePct}
              onChange={(e) => patch({ declividadePct: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="dmin">
              Diâmetro mínimo disponível (mm)
            </label>
            <input
              id="dmin"
              type="number"
              min="40"
              step="5"
              className={inputCls}
              value={state.diametroMinimoMm}
              onChange={(e) => patch({ diametroMinimoMm: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="forma">
              Forma da calha
            </label>
            <select
              id="forma"
              className={inputCls}
              value={state.formaCalha}
              onChange={(e) =>
                patch({ formaCalha: e.target.value as "retangular" | "semicircular" })
              }
            >
              <option value="retangular">Retangular (h ≈ b/2)</option>
              <option value="semicircular">Semicircular</option>
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="v">
              Velocidade de projeto na calha (m/s)
            </label>
            <input
              id="v"
              type="number"
              min="0.3"
              max="3"
              step="0.1"
              className={inputCls}
              value={state.velocidadeProjetoMs}
              onChange={(e) => patch({ velocidadeProjetoMs: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="ralo">
              Capacidade por ralo/grelha (L/s)
            </label>
            <input
              id="ralo"
              type="number"
              min="0.1"
              step="0.1"
              className={inputCls}
              value={state.capacidadeRaloLs}
              onChange={(e) => patch({ capacidadeRaloLs: Number(e.target.value) })}
            />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-3">
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
