import {
  ALBEDO_LABEL,
  CIDADES,
  MES_LABEL,
  OBSTRUCAO_LABEL,
  ORIENTACAO_LABEL,
  PELICULA_LABEL,
  PERSIANA_LABEL,
  PROTECOES_PADRAO,
  USO_LABEL,
  USO_TARGET,
  VIDRO_LABEL,
  type Albedo,
  type AmbienteInput,
  type Obstrucao,
  type Orientacao,
  type Pelicula,
  type Persiana,
  type TipoVidro,
  type UsoAmbiente,
} from "@/lib/iluminacao/calc";

const inputCls =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

const ORIENTACOES: Orientacao[] = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"];
const VIDROS: TipoVidro[] = ["simples", "duplo", "low-e", "refletivo"];
const OBSTRUCOES: Obstrucao[] = ["nenhuma", "parcial", "total"];
const PELICULAS: Pelicula[] = ["nenhuma", "leve", "media", "forte"];
const PERSIANAS: Persiana[] = ["nenhuma", "baixa", "media", "alta"];
const ALBEDOS: Albedo[] = ["claro", "medio", "escuro"];
const USOS: UsoAmbiente[] = ["escritorio", "sala", "circulacao", "escola", "personalizado"];

export function novoAmbiente(indice: number): AmbienteInput {
  return {
    id: `ambiente-${indice}`,
    nome: `Ambiente ${indice}`,
    orientacao: "L",
    cidadeId: "sao-paulo",
    mes: 3,
    larguraJanelaM: 2,
    alturaJanelaM: 1.5,
    areaAmbienteM2: 20,
    profundidadeM: 4,
    peDireitoM: 2.7,
    vidro: "simples",
    obstrucao: "nenhuma",
    albedo: "medio",
    uso: "escritorio",
    targetLux: USO_TARGET.escritorio,
    protecoes: { ...PROTECOES_PADRAO },
    faixas: [
      { inicio: 8, fim: 10 },
      { inicio: 10, fim: 14 },
      { inicio: 14, fim: 16 },
    ],
  };
}

export function IluminacaoForm({
  ambientes,
  setAmbientes,
  onCalculate,
  onReset,
}: {
  ambientes: AmbienteInput[];
  setAmbientes: (a: AmbienteInput[]) => void;
  onCalculate: () => void;
  onReset: () => void;
}) {
  const update = (id: string, patch: Partial<AmbienteInput>) =>
    setAmbientes(ambientes.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const updateProt = (id: string, patch: Partial<AmbienteInput["protecoes"]>) =>
    setAmbientes(
      ambientes.map((a) => (a.id === id ? { ...a, protecoes: { ...a.protecoes, ...patch } } : a)),
    );

  const trocarUso = (id: string, uso: UsoAmbiente) => {
    const patch: Partial<AmbienteInput> =
      uso === "personalizado" ? { uso } : { uso, targetLux: USO_TARGET[uso] };
    update(id, patch);
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
    >
      {ambientes.map((a, idx) => (
        <fieldset key={a.id} className="rounded-lg border border-border p-4">
          <legend className="px-1 text-sm font-semibold text-foreground">
            Ambiente {idx + 1}
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-foreground">Nome / ID</span>
              <input
                className={inputCls}
                value={a.nome}
                onChange={(e) => update(a.id, { nome: e.target.value })}
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Orientação da fachada</span>
              <select
                className={inputCls}
                value={a.orientacao}
                onChange={(e) => update(a.id, { orientacao: e.target.value as Orientacao })}
              >
                {ORIENTACOES.map((o) => (
                  <option key={o} value={o}>
                    {o} — {ORIENTACAO_LABEL[o]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Cidade</span>
              <select
                className={inputCls}
                value={a.cidadeId}
                onChange={(e) => update(a.id, { cidadeId: e.target.value })}
              >
                {CIDADES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Mês de referência</span>
              <select
                className={inputCls}
                value={a.mes}
                onChange={(e) => update(a.id, { mes: Number(e.target.value) })}
              >
                {MES_LABEL.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Largura da janela (m)</span>
              <input
                type="number"
                min={0}
                max={20}
                step="0.1"
                className={inputCls}
                value={a.larguraJanelaM}
                onChange={(e) => update(a.id, { larguraJanelaM: Number(e.target.value) })}
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Altura da janela (m)</span>
              <input
                type="number"
                min={0}
                max={20}
                step="0.1"
                className={inputCls}
                value={a.alturaJanelaM}
                onChange={(e) => update(a.id, { alturaJanelaM: Number(e.target.value) })}
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Área do ambiente (m²)</span>
              <input
                type="number"
                min={0}
                max={2000}
                step="0.5"
                className={inputCls}
                value={a.areaAmbienteM2}
                onChange={(e) => update(a.id, { areaAmbienteM2: Number(e.target.value) })}
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Profundidade interna (m)</span>
              <input
                type="number"
                min={0}
                max={40}
                step="0.1"
                className={inputCls}
                value={a.profundidadeM}
                onChange={(e) => update(a.id, { profundidadeM: Number(e.target.value) })}
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Pé-direito (m)</span>
              <input
                type="number"
                min={0}
                max={12}
                step="0.05"
                className={inputCls}
                value={a.peDireitoM}
                onChange={(e) => update(a.id, { peDireitoM: Number(e.target.value) })}
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Tipo de vidro</span>
              <select
                className={inputCls}
                value={a.vidro}
                onChange={(e) => update(a.id, { vidro: e.target.value as TipoVidro })}
              >
                {VIDROS.map((v) => (
                  <option key={v} value={v}>
                    {VIDRO_LABEL[v]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Obstrução externa</span>
              <select
                className={inputCls}
                value={a.obstrucao}
                onChange={(e) => update(a.id, { obstrucao: e.target.value as Obstrucao })}
              >
                {OBSTRUCOES.map((o) => (
                  <option key={o} value={o}>
                    {OBSTRUCAO_LABEL[o]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Refletância interna</span>
              <select
                className={inputCls}
                value={a.albedo}
                onChange={(e) => update(a.id, { albedo: e.target.value as Albedo })}
              >
                {ALBEDOS.map((v) => (
                  <option key={v} value={v}>
                    {ALBEDO_LABEL[v]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Uso do ambiente</span>
              <select
                className={inputCls}
                value={a.uso}
                onChange={(e) => trocarUso(a.id, e.target.value as UsoAmbiente)}
              >
                {USOS.map((u) => (
                  <option key={u} value={u}>
                    {USO_LABEL[u]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Iluminância alvo (lux)</span>
              <input
                type="number"
                min={0}
                step="10"
                className={inputCls}
                value={a.targetLux}
                onChange={(e) => update(a.id, { targetLux: Number(e.target.value) })}
              />
            </label>
          </div>

          <div className="mt-5 rounded-md border border-border bg-muted/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Proteções solares
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-foreground">Beiral (m)</span>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step="0.05"
                  className={inputCls}
                  value={a.protecoes.beiralM}
                  onChange={(e) => updateProt(a.id, { beiralM: Number(e.target.value) })}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-foreground">Brise horizontal (m)</span>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step="0.05"
                  className={inputCls}
                  value={a.protecoes.briseHorizM}
                  onChange={(e) => updateProt(a.id, { briseHorizM: Number(e.target.value) })}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-foreground">Brise vertical (m)</span>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step="0.05"
                  className={inputCls}
                  value={a.protecoes.briseVertM}
                  onChange={(e) => updateProt(a.id, { briseVertM: Number(e.target.value) })}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-foreground">Película</span>
                <select
                  className={inputCls}
                  value={a.protecoes.pelicula}
                  onChange={(e) => updateProt(a.id, { pelicula: e.target.value as Pelicula })}
                >
                  {PELICULAS.map((p) => (
                    <option key={p} value={p}>
                      {PELICULA_LABEL[p]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="font-medium text-foreground">Persiana interna</span>
                <select
                  className={inputCls}
                  value={a.protecoes.persiana}
                  onChange={(e) => updateProt(a.id, { persiana: e.target.value as Persiana })}
                >
                  {PERSIANAS.map((p) => (
                    <option key={p} value={p}>
                      {PERSIANA_LABEL[p]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="mt-5 rounded-md border border-border bg-muted/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Faixas horárias analisadas
            </p>
            <div className="mt-3 space-y-3">
              {a.faixas.map((f, i) => (
                <div key={`${a.id}-faixa-${i}`} className="flex flex-wrap items-end gap-3">
                  <label className="block text-sm">
                    <span className="font-medium text-foreground">Início (h)</span>
                    <input
                      type="number"
                      min={6}
                      max={18}
                      step="1"
                      className={`${inputCls} w-24`}
                      value={f.inicio}
                      onChange={(e) =>
                        update(a.id, {
                          faixas: a.faixas.map((x, j) =>
                            j === i ? { ...x, inicio: Number(e.target.value) } : x,
                          ),
                        })
                      }
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium text-foreground">Fim (h)</span>
                    <input
                      type="number"
                      min={6}
                      max={18}
                      step="1"
                      className={`${inputCls} w-24`}
                      value={f.fim}
                      onChange={(e) =>
                        update(a.id, {
                          faixas: a.faixas.map((x, j) =>
                            j === i ? { ...x, fim: Number(e.target.value) } : x,
                          ),
                        })
                      }
                    />
                  </label>
                  {a.faixas.length > 1 && (
                    <button
                      type="button"
                      className="rounded-md border border-input px-3 py-2 text-sm hover:bg-muted"
                      onClick={() =>
                        update(a.id, { faixas: a.faixas.filter((_, j) => j !== i) })
                      }
                    >
                      Remover faixa
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="rounded-md border border-input px-3 py-2 text-sm hover:bg-muted"
                onClick={() => update(a.id, { faixas: [...a.faixas, { inicio: 12, fim: 14 }] })}
              >
                + Adicionar faixa
              </button>
            </div>
          </div>

          {ambientes.length > 1 && (
            <button
              type="button"
              className="mt-4 rounded-md border border-input px-3 py-2 text-sm hover:bg-muted"
              onClick={() => setAmbientes(ambientes.filter((x) => x.id !== a.id))}
            >
              Remover ambiente
            </button>
          )}
        </fieldset>
      ))}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted"
          onClick={() => setAmbientes([...ambientes, novoAmbiente(ambientes.length + 1)])}
        >
          + Adicionar ambiente
        </button>
        <button
          type="submit"
          className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Calcular
        </button>
        <button
          type="button"
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted"
          onClick={onReset}
        >
          Limpar
        </button>
      </div>
    </form>
  );
}
