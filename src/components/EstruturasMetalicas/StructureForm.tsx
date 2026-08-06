import {
  APOIO_LABEL,
  FAMILIA_LABEL,
  MATERIAIS,
  TIPO_LABEL,
  type Apoio,
  type ElementoInput,
  type FamiliaPerfil,
  type MaterialId,
  type TipoElemento,
} from "@/lib/estruturas/calc";

const inputCls =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
const labelCls = "block text-sm font-medium text-foreground";

const TIPOS: TipoElemento[] = [
  "viga-simples",
  "viga-continua-2vaos",
  "portico-simples",
  "laje-metalica",
  "pilar",
];
const APOIOS: Apoio[] = ["biapoiado", "engastado"];
const MATERIAIS_IDS: MaterialId[] = ["S235", "S275", "S355"];
const FAMILIAS: Array<FamiliaPerfil | "auto"> = ["auto", "IPE", "HEA", "HEB", "TUBO"];

export function novoElemento(indice: number): ElementoInput {
  return {
    id: `elemento-${indice}-${Math.random().toString(36).slice(2, 7)}`,
    nome: `Viga V${indice}`,
    tipo: "viga-simples",
    vaoM: 6,
    alturaM: 3,
    cargaDistribuidaKnM: 5,
    cargaPontualKn: 0,
    apoio: "biapoiado",
    material: "S275",
    familia: "auto",
    fatorMargem: 1,
    quantidade: 1,
    extraCorteM: 0.1,
  };
}

export const PRESETS_RAPIDOS: ReadonlyArray<{ label: string; patch: Partial<ElementoInput> }> = [
  {
    label: "Viga de piso 6 m (q = 5 kN/m)",
    patch: { tipo: "viga-simples", vaoM: 6, cargaDistribuidaKnM: 5, cargaPontualKn: 0 },
  },
  {
    label: "Viga contínua 2×5 m (q = 8 kN/m)",
    patch: { tipo: "viga-continua-2vaos", vaoM: 5, cargaDistribuidaKnM: 8, cargaPontualKn: 0 },
  },
  {
    label: "Pórtico 5 m × 3 m (P = 10 kN)",
    patch: {
      tipo: "portico-simples",
      vaoM: 5,
      alturaM: 3,
      cargaDistribuidaKnM: 0,
      cargaPontualKn: 10,
    },
  },
  {
    label: "Terça de cobertura 4 m (q = 2 kN/m)",
    patch: { tipo: "viga-simples", vaoM: 4, cargaDistribuidaKnM: 2, cargaPontualKn: 0 },
  },
];

interface StructureFormProps {
  elementos: ElementoInput[];
  setElementos: (els: ElementoInput[]) => void;
  onCalculate: () => void;
  onReset: () => void;
}

export function StructureForm({
  elementos,
  setElementos,
  onCalculate,
  onReset,
}: StructureFormProps) {
  const atualizar = (id: string, patch: Partial<ElementoInput>) =>
    setElementos(elementos.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const remover = (id: string) => setElementos(elementos.filter((e) => e.id !== id));

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground">Elementos da estrutura</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cadastre cada viga, pórtico ou pilar com o vão, as cargas de serviço e o material.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS_RAPIDOS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              const primeiro = elementos[0];
              if (primeiro) atualizar(primeiro.id, p.patch);
            }}
            className="rounded-full border border-input bg-background px-3 py-1 text-xs font-medium text-foreground hover:bg-muted"
          >
            {p.label}
          </button>
        ))}
      </div>

      {elementos.map((el, i) => {
        const precisaAltura = el.tipo === "portico-simples" || el.tipo === "pilar";
        return (
          <fieldset key={el.id} className="rounded-lg border border-border p-4">
            <legend className="px-2 text-sm font-semibold text-foreground">
              Elemento {i + 1}
            </legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor={`${el.id}-nome`}>
                  Identificação
                </label>
                <input
                  id={`${el.id}-nome`}
                  type="text"
                  value={el.nome}
                  onChange={(e) => atualizar(el.id, { nome: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor={`${el.id}-tipo`}>
                  Tipo de elemento
                </label>
                <select
                  id={`${el.id}-tipo`}
                  value={el.tipo}
                  onChange={(e) => atualizar(el.id, { tipo: e.target.value as TipoElemento })}
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
                <label className={labelCls} htmlFor={`${el.id}-vao`}>
                  Vão / comprimento (m)
                </label>
                <input
                  id={`${el.id}-vao`}
                  type="number"
                  step="0.1"
                  min="0"
                  value={el.vaoM}
                  onChange={(e) => atualizar(el.id, { vaoM: Number(e.target.value) })}
                  className={inputCls}
                />
              </div>

              {precisaAltura && (
                <div>
                  <label className={labelCls} htmlFor={`${el.id}-altura`}>
                    Altura do pilar (m)
                  </label>
                  <input
                    id={`${el.id}-altura`}
                    type="number"
                    step="0.1"
                    min="0"
                    value={el.alturaM}
                    onChange={(e) => atualizar(el.id, { alturaM: Number(e.target.value) })}
                    className={inputCls}
                  />
                </div>
              )}

              <div>
                <label className={labelCls} htmlFor={`${el.id}-q`}>
                  Carga distribuída q (kN/m)
                </label>
                <input
                  id={`${el.id}-q`}
                  type="number"
                  step="0.1"
                  min="0"
                  value={el.cargaDistribuidaKnM}
                  onChange={(e) =>
                    atualizar(el.id, { cargaDistribuidaKnM: Number(e.target.value) })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls} htmlFor={`${el.id}-p`}>
                  Carga pontual P (kN)
                </label>
                <input
                  id={`${el.id}-p`}
                  type="number"
                  step="0.1"
                  min="0"
                  value={el.cargaPontualKn}
                  onChange={(e) => atualizar(el.id, { cargaPontualKn: Number(e.target.value) })}
                  className={inputCls}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Aplicada no meio do vão (vigas) ou no topo (pilares).
                </p>
              </div>

              <div>
                <label className={labelCls} htmlFor={`${el.id}-apoio`}>
                  Condição de apoio
                </label>
                <select
                  id={`${el.id}-apoio`}
                  value={el.apoio}
                  onChange={(e) => atualizar(el.id, { apoio: e.target.value as Apoio })}
                  className={inputCls}
                >
                  {APOIOS.map((a) => (
                    <option key={a} value={a}>
                      {APOIO_LABEL[a]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls} htmlFor={`${el.id}-material`}>
                  Material
                </label>
                <select
                  id={`${el.id}-material`}
                  value={el.material}
                  onChange={(e) => atualizar(el.id, { material: e.target.value as MaterialId })}
                  className={inputCls}
                >
                  {MATERIAIS_IDS.map((m) => (
                    <option key={m} value={m}>
                      {MATERIAIS[m].nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls} htmlFor={`${el.id}-familia`}>
                  Preferência de perfil
                </label>
                <select
                  id={`${el.id}-familia`}
                  value={el.familia}
                  onChange={(e) =>
                    atualizar(el.id, { familia: e.target.value as FamiliaPerfil | "auto" })
                  }
                  className={inputCls}
                >
                  {FAMILIAS.map((f) => (
                    <option key={f} value={f}>
                      {FAMILIA_LABEL[f]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls} htmlFor={`${el.id}-margem`}>
                  Fator de margem
                </label>
                <input
                  id={`${el.id}-margem`}
                  type="number"
                  step="0.05"
                  min="1"
                  max="2"
                  value={el.fatorMargem}
                  onChange={(e) => atualizar(el.id, { fatorMargem: Number(e.target.value) })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls} htmlFor={`${el.id}-qtd`}>
                  Quantidade de peças
                </label>
                <input
                  id={`${el.id}-qtd`}
                  type="number"
                  step="1"
                  min="1"
                  value={el.quantidade}
                  onChange={(e) =>
                    atualizar(el.id, { quantidade: Math.round(Number(e.target.value)) })
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls} htmlFor={`${el.id}-extra`}>
                  Extra de corte por peça (m)
                </label>
                <input
                  id={`${el.id}-extra`}
                  type="number"
                  step="0.01"
                  min="0"
                  max="2"
                  value={el.extraCorteM}
                  onChange={(e) => atualizar(el.id, { extraCorteM: Number(e.target.value) })}
                  className={inputCls}
                />
              </div>
            </div>

            {elementos.length > 1 && (
              <button
                type="button"
                onClick={() => remover(el.id)}
                className="mt-4 text-sm font-medium text-destructive underline"
              >
                Remover elemento
              </button>
            )}
          </fieldset>
        );
      })}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Calcular
        </button>
        <button
          type="button"
          onClick={() => setElementos([...elementos, novoElemento(elementos.length + 1)])}
          className="rounded-md border border-input bg-background px-5 py-2 text-sm font-medium hover:bg-muted"
        >
          Adicionar elemento
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
