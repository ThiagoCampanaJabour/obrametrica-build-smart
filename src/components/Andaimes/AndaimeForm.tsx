import {
  CARGA_LABEL,
  PRESETS,
  SISTEMA_LABEL,
  type CargaTrabalho,
  type SistemaAndaime,
  type TrechoInput,
} from "@/lib/andaimes/calc";

const inputCls =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

const SISTEMAS: SistemaAndaime[] = [
  "tubular-fachada",
  "multidirecional",
  "escora-metalica",
  "escora-madeira",
];
const CARGAS: CargaTrabalho[] = ["leve", "media", "pesada"];

export function novoTrecho(indice: number): TrechoInput {
  const p = PRESETS["tubular-fachada"];
  return {
    id: `trecho-${indice}`,
    nome: `Fachada ${String.fromCharCode(65 + ((indice - 1) % 26))}`,
    larguraM: 10,
    alturaM: 6,
    carga: "leve",
    sistema: "tubular-fachada",
    moduleWidthM: p.moduleWidthM,
    platformDepthM: p.platformDepthM,
    spacingVerticalM: p.spacingVerticalM,
    acessos: 1,
    margemPct: 10,
  };
}

export function AndaimeForm({
  trechos,
  setTrechos,
  onCalculate,
  onReset,
}: {
  trechos: TrechoInput[];
  setTrechos: (t: TrechoInput[]) => void;
  onCalculate: () => void;
  onReset: () => void;
}) {
  const update = (id: string, patch: Partial<TrechoInput>) =>
    setTrechos(trechos.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const trocarSistema = (id: string, sistema: SistemaAndaime) => {
    const p = PRESETS[sistema];
    update(id, {
      sistema,
      moduleWidthM: p.moduleWidthM,
      platformDepthM: p.platformDepthM,
      spacingVerticalM: p.spacingVerticalM,
    });
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
    >
      {trechos.map((t, idx) => (
        <fieldset key={t.id} className="rounded-lg border border-border p-4">
          <legend className="px-1 text-sm font-semibold text-foreground">Trecho {idx + 1}</legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-foreground">Nome / ID</span>
              <input
                className={inputCls}
                value={t.nome}
                onChange={(e) => update(t.id, { nome: e.target.value })}
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Sistema</span>
              <select
                className={inputCls}
                value={t.sistema}
                onChange={(e) => trocarSistema(t.id, e.target.value as SistemaAndaime)}
              >
                {SISTEMAS.map((s) => (
                  <option key={s} value={s}>
                    {SISTEMA_LABEL[s]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Largura (m)</span>
              <input
                type="number"
                min={0}
                max={100}
                step="0.1"
                className={inputCls}
                value={t.larguraM}
                onChange={(e) => update(t.id, { larguraM: Number(e.target.value) })}
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Altura (m)</span>
              <input
                type="number"
                min={0}
                max={200}
                step="0.1"
                className={inputCls}
                value={t.alturaM}
                onChange={(e) => update(t.id, { alturaM: Number(e.target.value) })}
              />
            </label>

            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-foreground">Carga de trabalho</span>
              <select
                className={inputCls}
                value={t.carga}
                onChange={(e) => update(t.id, { carga: e.target.value as CargaTrabalho })}
              >
                {CARGAS.map((c) => (
                  <option key={c} value={c}>
                    {CARGA_LABEL[c]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Largura do módulo (m)</span>
              <input
                type="number"
                min={0.5}
                step="0.1"
                className={inputCls}
                value={t.moduleWidthM}
                title="Largura comercial de cada módulo do sistema."
                onChange={(e) => update(t.id, { moduleWidthM: Number(e.target.value) })}
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Espaçamento vertical (m)</span>
              <input
                type="number"
                min={0.5}
                step="0.1"
                className={inputCls}
                value={t.spacingVerticalM}
                title="Distância entre plataformas: define o número de níveis."
                onChange={(e) => update(t.id, { spacingVerticalM: Number(e.target.value) })}
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Profundidade da plataforma (m)</span>
              <input
                type="number"
                min={0.3}
                step="0.05"
                className={inputCls}
                value={t.platformDepthM}
                onChange={(e) => update(t.id, { platformDepthM: Number(e.target.value) })}
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Acessos (escadas/rampas)</span>
              <input
                type="number"
                min={0}
                step="1"
                className={inputCls}
                value={t.acessos ?? 0}
                onChange={(e) => update(t.id, { acessos: Number(e.target.value) })}
              />
            </label>

            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-foreground">Margem de segurança (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                step="1"
                className={inputCls}
                value={t.margemPct ?? 10}
                title="Peças reserva para avarias e perdas de locação."
                onChange={(e) => update(t.id, { margemPct: Number(e.target.value) })}
              />
            </label>
          </div>

          {trechos.length > 1 && (
            <button
              type="button"
              className="mt-4 rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-muted"
              onClick={() => setTrechos(trechos.filter((x) => x.id !== t.id))}
            >
              Remover trecho
            </button>
          )}
        </fieldset>
      ))}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted"
          onClick={() => setTrechos([...trechos, novoTrecho(trechos.length + 1)])}
        >
          Adicionar fachada / trecho
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
