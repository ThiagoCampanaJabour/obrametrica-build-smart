import { useState } from "react";
import {
  DEFAULT_LAYOUT_INPUT,
  PRESET_MODULOS,
  type LayoutInput,
  type Montagem,
  type Obstaculo,
  type TipoLocal,
} from "@/lib/solar/layout-calc";

function NumField({
  label,
  value,
  onChange,
  step = 0.1,
  min,
  suffix,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  suffix?: string;
  hint?: string;
}) {
  const id = `lf-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-xs font-medium text-muted-foreground">
        {label}
        {suffix ? ` (${suffix})` : ""}
      </label>
      <input
        id={id}
        type="number"
        step={step}
        min={min}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
      />
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function LayoutForm({ onCalc }: { onCalc: (input: LayoutInput) => void }) {
  const [i, setI] = useState<LayoutInput>(DEFAULT_LAYOUT_INPUT);
  const [presetIdx, setPresetIdx] = useState(1);
  const [avancado, setAvancado] = useState(false);
  const [modoAlvo, setModoAlvo] = useState<"maximo" | "modulos" | "potencia">("maximo");

  const set = <K extends keyof LayoutInput>(k: K, v: LayoutInput[K]) =>
    setI((p) => ({ ...p, [k]: v }));

  const setModulo = (patch: Partial<LayoutInput["modulo"]>) =>
    setI((p) => ({ ...p, modulo: { ...p.modulo, ...patch } }));

  const addObstaculo = () =>
    setI((p) => ({
      ...p,
      obstaculos: [
        ...p.obstaculos,
        {
          id: `o${p.obstaculos.length + 1}`,
          label: `Obstáculo ${p.obstaculos.length + 1}`,
          x_m: 1,
          y_m: 1,
          largura_m: 1,
          profundidade_m: 1,
          altura_m: 1,
        },
      ],
    }));

  const updObstaculo = (idx: number, patch: Partial<Obstaculo>) =>
    setI((p) => ({
      ...p,
      obstaculos: p.obstaculos.map((o, k) => (k === idx ? { ...o, ...patch } : o)),
    }));

  const delObstaculo = (idx: number) =>
    setI((p) => ({ ...p, obstaculos: p.obstaculos.filter((_, k) => k !== idx) }));

  const submit = () => {
    const payload: LayoutInput = {
      ...i,
      alvoModulos: modoAlvo === "modulos" ? i.alvoModulos : undefined,
      alvoPotencia_kWp: modoAlvo === "potencia" ? i.alvoPotencia_kWp : undefined,
    };
    onCalc(payload);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="space-y-6"
    >
      <fieldset>
        <legend className="text-sm font-semibold text-foreground">1 · Área disponível</legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-0">
            <label htmlFor="lf-nome" className="block text-xs font-medium text-muted-foreground">
              Identificação
            </label>
            <input
              id="lf-nome"
              type="text"
              value={i.nome}
              onChange={(e) => set("nome", e.currentTarget.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
          <div className="min-w-0">
            <label htmlFor="lf-tipo" className="block text-xs font-medium text-muted-foreground">
              Tipo de local
            </label>
            <select
              id="lf-tipo"
              value={i.tipoLocal}
              onChange={(e) => set("tipoLocal", e.currentTarget.value as TipoLocal)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="telhado-plano">Telhado plano</option>
              <option value="telhado-inclinado">Telhado inclinado</option>
              <option value="solo">Solo (ground mount)</option>
            </select>
          </div>
          <NumField
            label="Largura da área (X)"
            suffix="m"
            min={0}
            value={i.areaLargura_m}
            onChange={(v) => set("areaLargura_m", v)}
          />
          <NumField
            label="Comprimento da área (Y)"
            suffix="m"
            min={0}
            value={i.areaComprimento_m}
            onChange={(v) => set("areaComprimento_m", v)}
          />
          <NumField
            label="Inclinação"
            suffix="°"
            min={0}
            step={1}
            value={i.inclinacao_deg}
            onChange={(v) => set("inclinacao_deg", v)}
            hint={i.tipoLocal === "telhado-inclinado" ? "Inclinação da água." : "Tilt da estrutura."}
          />
          <NumField
            label="Azimute da área"
            suffix="° (0=N)"
            min={0}
            step={5}
            value={i.azimute_deg}
            onChange={(v) => set("azimute_deg", v)}
          />
          <NumField
            label="Latitude"
            suffix="°"
            step={0.01}
            value={i.latitude_deg}
            onChange={(v) => set("latitude_deg", v)}
            hint="Negativa no hemisfério sul (ex.: −23,55)."
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-foreground">2 · Módulo fotovoltaico</legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-0">
            <label htmlFor="lf-preset" className="block text-xs font-medium text-muted-foreground">
              Preset
            </label>
            <select
              id="lf-preset"
              value={presetIdx}
              onChange={(e) => {
                const idx = Number(e.currentTarget.value);
                setPresetIdx(idx);
                const p = PRESET_MODULOS[idx];
                if (p) set("modulo", { ...p });
              }}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              {PRESET_MODULOS.map((p, idx) => (
                <option key={p.label} value={idx}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <NumField
            label="Potência do módulo"
            suffix="Wp"
            step={5}
            min={0}
            value={i.modulo.pmp_W}
            onChange={(v) => setModulo({ pmp_W: v })}
          />
          <div className="min-w-0">
            <label htmlFor="lf-mont" className="block text-xs font-medium text-muted-foreground">
              Montagem
            </label>
            <select
              id="lf-mont"
              value={i.montagem}
              onChange={(e) => set("montagem", e.currentTarget.value as Montagem)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="paisagem">Paisagem (deitado)</option>
              <option value="retrato">Retrato (em pé)</option>
            </select>
          </div>
          <NumField
            label="Comprimento do módulo"
            suffix="m"
            step={0.01}
            min={0}
            value={i.modulo.comprimento_m}
            onChange={(v) => setModulo({ comprimento_m: v })}
          />
          <NumField
            label="Largura do módulo"
            suffix="m"
            step={0.01}
            min={0}
            value={i.modulo.largura_m}
            onChange={(v) => setModulo({ largura_m: v })}
          />
          <NumField
            label="Módulos por string"
            step={1}
            min={1}
            value={i.modulosPorString}
            onChange={(v) => set("modulosPorString", v)}
            hint="Típico 8 a 15, conforme a faixa MPPT do inversor."
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-foreground">3 · Montagem e restrições</legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NumField
            label="Gap transversal"
            suffix="m"
            step={0.005}
            min={0}
            value={i.gapTransversal_m}
            onChange={(v) => set("gapTransversal_m", v)}
          />
          <NumField
            label="Gap longitudinal"
            suffix="m"
            step={0.005}
            min={0}
            value={i.gapLongitudinal_m}
            onChange={(v) => set("gapLongitudinal_m", v)}
          />
          <NumField
            label="Margem de borda"
            suffix="m"
            step={0.05}
            min={0}
            value={i.margemBorda_m}
            onChange={(v) => set("margemBorda_m", v)}
          />
          <NumField
            label="Corredor de manutenção"
            suffix="m"
            step={0.05}
            min={0}
            value={i.corredorManutencao_m}
            onChange={(v) => set("corredorManutencao_m", v)}
            hint="Mínimo recomendado: 0,60 m."
          />
          <NumField
            label="Fileiras por bloco"
            step={1}
            min={0}
            value={i.fileirasPorBloco}
            onChange={(v) => set("fileirasPorBloco", v)}
            hint="0 desativa os corredores."
          />
          <NumField
            label="Cobertura máxima"
            suffix="%"
            step={5}
            min={0}
            value={i.coberturaMax_pct}
            onChange={(v) => set("coberturaMax_pct", v)}
          />
        </div>
        <label className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={i.usarEspacamentoFileiras}
            onChange={(e) => set("usarEspacamentoFileiras", e.currentTarget.checked)}
            className="h-4 w-4 rounded border-input"
          />
          Aplicar espaçamento entre fileiras (evita sombreamento mútuo em telhado plano/solo)
        </label>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-foreground">4 · Meta do sistema</legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div className="min-w-0">
            <label htmlFor="lf-modo" className="block text-xs font-medium text-muted-foreground">
              Critério
            </label>
            <select
              id="lf-modo"
              value={modoAlvo}
              onChange={(e) => setModoAlvo(e.currentTarget.value as typeof modoAlvo)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="maximo">Ocupar o máximo possível</option>
              <option value="modulos">Fixar número de módulos</option>
              <option value="potencia">Fixar potência alvo</option>
            </select>
          </div>
          {modoAlvo === "modulos" && (
            <NumField
              label="Módulos desejados"
              step={1}
              min={1}
              value={i.alvoModulos ?? 20}
              onChange={(v) => set("alvoModulos", v)}
            />
          )}
          {modoAlvo === "potencia" && (
            <NumField
              label="Potência alvo"
              suffix="kWp"
              step={0.5}
              min={0}
              value={i.alvoPotencia_kWp ?? 10}
              onChange={(v) => set("alvoPotencia_kWp", v)}
            />
          )}
          <NumField
            label="Módulos reserva"
            suffix="%"
            step={1}
            min={0}
            value={i.reserva_pct}
            onChange={(v) => set("reserva_pct", v)}
          />
        </div>
      </fieldset>

      <fieldset>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <legend className="text-sm font-semibold text-foreground">
            5 · Obstáculos (opcional)
          </legend>
          <button
            type="button"
            onClick={() => setAvancado((v) => !v)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            {avancado ? "Ocultar" : "Editar obstáculos"}
          </button>
        </div>
        {avancado && (
          <div className="mt-3 space-y-3">
            {i.obstaculos.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Nenhum obstáculo cadastrado. Adicione chaminés, caixas d’água, exaustores ou domus.
              </p>
            )}
            {i.obstaculos.map((o, idx) => (
              <div
                key={o.id}
                className="grid gap-3 rounded-lg border border-border bg-muted/20 p-3 sm:grid-cols-3 lg:grid-cols-6"
              >
                <div className="min-w-0">
                  <label
                    htmlFor={`obs-label-${idx}`}
                    className="block text-xs font-medium text-muted-foreground"
                  >
                    Nome
                  </label>
                  <input
                    id={`obs-label-${idx}`}
                    type="text"
                    value={o.label}
                    onChange={(e) => updObstaculo(idx, { label: e.currentTarget.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground"
                  />
                </div>
                <NumField
                  label={`X ${idx + 1}`}
                  suffix="m"
                  step={0.1}
                  value={o.x_m}
                  onChange={(v) => updObstaculo(idx, { x_m: v })}
                />
                <NumField
                  label={`Y ${idx + 1}`}
                  suffix="m"
                  step={0.1}
                  value={o.y_m}
                  onChange={(v) => updObstaculo(idx, { y_m: v })}
                />
                <NumField
                  label={`Largura ${idx + 1}`}
                  suffix="m"
                  step={0.1}
                  value={o.largura_m}
                  onChange={(v) => updObstaculo(idx, { largura_m: v })}
                />
                <NumField
                  label={`Profundidade ${idx + 1}`}
                  suffix="m"
                  step={0.1}
                  value={o.profundidade_m}
                  onChange={(v) => updObstaculo(idx, { profundidade_m: v })}
                />
                <div className="flex items-end gap-2">
                  <NumField
                    label={`Altura ${idx + 1}`}
                    suffix="m"
                    step={0.1}
                    value={o.altura_m}
                    onChange={(v) => updObstaculo(idx, { altura_m: v })}
                  />
                  <button
                    type="button"
                    onClick={() => delObstaculo(idx)}
                    className="mb-1 rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground hover:bg-muted"
                    aria-label={`Remover ${o.label}`}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addObstaculo}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              Adicionar obstáculo
            </button>
          </div>
        )}
      </fieldset>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Gerar layout
        </button>
        <button
          type="button"
          onClick={() => {
            setI(DEFAULT_LAYOUT_INPUT);
            setPresetIdx(1);
            setModoAlvo("maximo");
          }}
          className="rounded-md border border-input bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Limpar
        </button>
      </div>
    </form>
  );
}
