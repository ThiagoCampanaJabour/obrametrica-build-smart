import {
  CLIMAS,
  ISOLAMENTO_LABEL,
  ORIENTACAO_LABEL,
  SHGC_PRESETS,
  USO_LABEL,
  USO_PRESETS,
  VIDRO_LABEL,
  type Ambiente,
  type Isolamento,
  type Modo,
  type Orientacao,
  type TipoVidro,
  type UsoAmbiente,
} from "@/lib/hvac/calc";

export type HVACFormState = {
  modo: Modo;
  ambientes: Ambiente[];
  cidade: string;
  tIntC: number;
  tExtC: number;
  margemPct: number;
  cop: number;
  horasDia: number;
  diasMes: number;
  tipoVidro: TipoVidro;
};

export const NOVO_AMBIENTE: Ambiente = {
  nome: "Novo ambiente",
  areaM2: 12,
  peDireitoM: 2.7,
  orientacao: "O",
  areaVidroM2: 2,
  isolamento: "media",
  ocupantes: 2,
  equipamentosW: 0,
  uso: "residencial",
  fachadasExternas: 1,
  coberturaExposta: true,
  sombreamentoPct: 0,
};

export const DEFAULT_HVAC_FORM: HVACFormState = {
  modo: "rapido",
  ambientes: [
    {
      ...NOVO_AMBIENTE,
      nome: "Quarto 1",
      areaM2: 9,
      areaVidroM2: 1.5,
      orientacao: "S",
      ocupantes: 1,
    },
  ],
  cidade: "São Paulo",
  tIntC: 24,
  tExtC: 32,
  margemPct: 15,
  cop: 3.2,
  horasDia: 8,
  diasMes: 30,
  tipoVidro: "simples",
};

const inputCls =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
const labelCls = "block text-xs font-medium text-muted-foreground";

const ORIENTACOES = Object.keys(ORIENTACAO_LABEL) as Orientacao[];

export function HVACForm({
  state,
  setState,
  onCalculate,
  onReset,
}: {
  state: HVACFormState;
  setState: (s: HVACFormState) => void;
  onCalculate: () => void;
  onReset: () => void;
}) {
  const patch = (p: Partial<HVACFormState>) => setState({ ...state, ...p });
  const setAmb = (i: number, p: Partial<Ambiente>) =>
    patch({ ambientes: state.ambientes.map((a, idx) => (idx === i ? { ...a, ...p } : a)) });

  const avancado = state.modo === "avancado";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
      className="space-y-6"
    >
      <fieldset>
        <legend className="text-sm font-semibold text-foreground">Modo de cálculo</legend>
        <div className="mt-2 inline-flex rounded-md border border-input p-1">
          {(["rapido", "avancado"] as Modo[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => patch({ modo: m })}
              aria-pressed={state.modo === m}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                state.modo === m
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {m === "rapido" ? "Rápido (simplificado)" : "Avançado (orientativo)"}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-foreground">Ambientes</legend>

        {state.ambientes.map((a, i) => (
          <div key={i} className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ambiente {i + 1}
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    patch({
                      ambientes: [
                        ...state.ambientes.slice(0, i + 1),
                        { ...a, nome: `${a.nome} (cópia)` },
                        ...state.ambientes.slice(i + 1),
                      ],
                    })
                  }
                  className="text-xs font-medium text-foreground hover:underline"
                >
                  Duplicar
                </button>
                {state.ambientes.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      patch({ ambientes: state.ambientes.filter((_, idx) => idx !== i) })
                    }
                    className="text-xs font-medium text-destructive hover:underline"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor={`nome-${i}`}>
                  Nome do ambiente
                </label>
                <input
                  id={`nome-${i}`}
                  className={inputCls}
                  value={a.nome}
                  onChange={(e) => setAmb(i, { nome: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor={`area-${i}`}>
                  Área útil (m²)
                </label>
                <input
                  id={`area-${i}`}
                  type="number"
                  min="1"
                  step="0.1"
                  className={inputCls}
                  value={a.areaM2}
                  onChange={(e) => setAmb(i, { areaM2: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor={`pd-${i}`}>
                  Pé-direito (m)
                </label>
                <input
                  id={`pd-${i}`}
                  type="number"
                  min="2"
                  step="0.05"
                  className={inputCls}
                  value={a.peDireitoM}
                  onChange={(e) => setAmb(i, { peDireitoM: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor={`ori-${i}`}>
                  Orientação da fachada
                </label>
                <select
                  id={`ori-${i}`}
                  className={inputCls}
                  value={a.orientacao}
                  onChange={(e) => setAmb(i, { orientacao: e.target.value as Orientacao })}
                >
                  {ORIENTACOES.map((o) => (
                    <option key={o} value={o}>
                      {ORIENTACAO_LABEL[o]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor={`vidro-${i}`}>
                  Área de janelas (m²)
                </label>
                <input
                  id={`vidro-${i}`}
                  type="number"
                  min="0"
                  step="0.1"
                  className={inputCls}
                  value={a.areaVidroM2}
                  onChange={(e) => setAmb(i, { areaVidroM2: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor={`iso-${i}`}>
                  Isolamento da envoltória
                </label>
                <select
                  id={`iso-${i}`}
                  className={inputCls}
                  value={a.isolamento}
                  onChange={(e) => setAmb(i, { isolamento: e.target.value as Isolamento })}
                >
                  {(Object.keys(ISOLAMENTO_LABEL) as Isolamento[]).map((k) => (
                    <option key={k} value={k}>
                      {ISOLAMENTO_LABEL[k]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor={`uso-${i}`}>
                  Uso do ambiente
                </label>
                <select
                  id={`uso-${i}`}
                  className={inputCls}
                  value={a.uso}
                  onChange={(e) => setAmb(i, { uso: e.target.value as UsoAmbiente })}
                >
                  {(Object.keys(USO_LABEL) as UsoAmbiente[]).map((k) => (
                    <option key={k} value={k}>
                      {USO_LABEL[k]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor={`ocup-${i}`}>
                  Ocupantes
                </label>
                <input
                  id={`ocup-${i}`}
                  type="number"
                  min="0"
                  step="1"
                  className={inputCls}
                  value={a.ocupantes}
                  onChange={(e) => setAmb(i, { ocupantes: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor={`eq-${i}`}>
                  Equipamentos + luzes (W)
                </label>
                <input
                  id={`eq-${i}`}
                  type="number"
                  min="0"
                  step="10"
                  className={inputCls}
                  value={a.equipamentosW}
                  onChange={(e) => setAmb(i, { equipamentosW: Number(e.target.value) })}
                  aria-describedby={`eq-desc-${i}`}
                />
                <p id={`eq-desc-${i}`} className="mt-1 text-[11px] text-muted-foreground">
                  0 = usar preset de {USO_PRESETS[a.uso].equipWm2} W/m².
                </p>
              </div>

              {avancado && (
                <>
                  <div>
                    <label className={labelCls} htmlFor={`fach-${i}`}>
                      Fachadas externas (1–4)
                    </label>
                    <input
                      id={`fach-${i}`}
                      type="number"
                      min="1"
                      max="4"
                      step="1"
                      className={inputCls}
                      value={a.fachadasExternas ?? 1}
                      onChange={(e) => setAmb(i, { fachadasExternas: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor={`somb-${i}`}>
                      Sombreamento (%)
                    </label>
                    <input
                      id={`somb-${i}`}
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      className={inputCls}
                      value={a.sombreamentoPct ?? 0}
                      onChange={(e) => setAmb(i, { sombreamentoPct: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor={`up-${i}`}>
                      U parede (W/m²·K)
                    </label>
                    <input
                      id={`up-${i}`}
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="preset"
                      className={inputCls}
                      value={a.uParede ?? ""}
                      onChange={(e) =>
                        setAmb(i, {
                          uParede: e.target.value === "" ? undefined : Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor={`uc-${i}`}>
                      U cobertura (W/m²·K)
                    </label>
                    <input
                      id={`uc-${i}`}
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="preset"
                      className={inputCls}
                      value={a.uCobertura ?? ""}
                      onChange={(e) =>
                        setAmb(i, {
                          uCobertura: e.target.value === "" ? undefined : Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor={`uj-${i}`}>
                      U janela (W/m²·K)
                    </label>
                    <input
                      id={`uj-${i}`}
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="preset"
                      className={inputCls}
                      value={a.uJanela ?? ""}
                      onChange={(e) =>
                        setAmb(i, {
                          uJanela: e.target.value === "" ? undefined : Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor={`ach-${i}`}>
                      Infiltração / renovações (ACH)
                    </label>
                    <input
                      id={`ach-${i}`}
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="preset"
                      className={inputCls}
                      value={a.achInfiltracao ?? ""}
                      onChange={(e) =>
                        setAmb(i, {
                          achInfiltracao:
                            e.target.value === "" ? undefined : Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={a.coberturaExposta ?? true}
                        onChange={(e) => setAmb(i, { coberturaExposta: e.target.checked })}
                      />
                      Cobertura exposta ao sol (último pavimento / telhado)
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => patch({ ambientes: [...state.ambientes, { ...NOVO_AMBIENTE }] })}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
        >
          + Adicionar ambiente
        </button>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-foreground">Clima e projeto</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="cidade">
              Cidade (preset climático)
            </label>
            <select
              id="cidade"
              className={inputCls}
              value={state.cidade}
              onChange={(e) => {
                const c = CLIMAS.find((x) => x.cidade === e.target.value);
                patch({ cidade: e.target.value, tExtC: c ? c.tExtC : state.tExtC });
              }}
            >
              {CLIMAS.map((c) => (
                <option key={c.cidade} value={c.cidade}>
                  {c.cidade} — {c.tExtC} °C
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="tipoVidro">
              Tipo de vidro (SHGC)
            </label>
            <select
              id="tipoVidro"
              className={inputCls}
              value={state.tipoVidro}
              onChange={(e) => {
                const t = e.target.value as TipoVidro;
                patch({
                  tipoVidro: t,
                  ambientes: state.ambientes.map((a) => ({ ...a, shgc: SHGC_PRESETS[t] })),
                });
              }}
            >
              {(Object.keys(VIDRO_LABEL) as TipoVidro[]).map((k) => (
                <option key={k} value={k}>
                  {VIDRO_LABEL[k]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="tint">
              Temperatura interna desejada (°C)
            </label>
            <input
              id="tint"
              type="number"
              step="0.5"
              className={inputCls}
              value={state.tIntC}
              onChange={(e) => patch({ tIntC: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="text">
              Temperatura externa de projeto (°C)
            </label>
            <input
              id="text"
              type="number"
              step="0.5"
              className={inputCls}
              value={state.tExtC}
              onChange={(e) => patch({ tExtC: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="margem">
              Margem de segurança (%)
            </label>
            <input
              id="margem"
              type="number"
              min="0"
              max="50"
              step="5"
              className={inputCls}
              value={state.margemPct}
              onChange={(e) => patch({ margemPct: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="cop">
              COP / eficiência do equipamento
            </label>
            <input
              id="cop"
              type="number"
              min="1"
              step="0.1"
              className={inputCls}
              value={state.cop}
              onChange={(e) => patch({ cop: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="horas">
              Horas de uso por dia
            </label>
            <input
              id="horas"
              type="number"
              min="1"
              max="24"
              step="1"
              className={inputCls}
              value={state.horasDia}
              onChange={(e) => patch({ horasDia: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="dias">
              Dias de uso por mês
            </label>
            <input
              id="dias"
              type="number"
              min="1"
              max="31"
              step="1"
              className={inputCls}
              value={state.diasMes}
              onChange={(e) => patch({ diasMes: Number(e.target.value) })}
            />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-3 pt-2">
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
