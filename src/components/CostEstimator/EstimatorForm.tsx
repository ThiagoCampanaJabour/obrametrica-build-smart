import { useEffect, useState } from "react";
import {
  DEFAULT_COST_INPUT,
  PRESET_ESTRUTURAS,
  PRESET_INVERSORES,
  PRESET_MODULOS,
  type CostInput,
  type ModoLogistica,
  type ModoMaoObra,
  type Montagem,
} from "@/lib/solar/cost-estimator";

const STORAGE_KEY = "obrametrica:tco-solar:v1";

function NumField({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
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
  const id = `ce-${label.replace(/\W+/g, "-").toLowerCase()}`;
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-sm font-semibold text-foreground">{title}</legend>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </fieldset>
  );
}

export function EstimatorForm({ onCalc }: { onCalc: (input: CostInput) => void }) {
  const [i, setI] = useState<CostInput>(DEFAULT_COST_INPUT);
  const [comBateria, setComBateria] = useState(false);
  const [salvo, setSalvo] = useState<string | null>(null);

  const set = <K extends keyof CostInput>(k: K, v: CostInput[K]) => setI((p) => ({ ...p, [k]: v }));
  const patch = <K extends keyof CostInput>(k: K, v: Partial<CostInput[K]>) =>
    setI((p) => ({ ...p, [k]: { ...(p[k] as object), ...v } as CostInput[K] }));

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CostInput;
        setI({ ...DEFAULT_COST_INPUT, ...parsed });
        setComBateria(Boolean(parsed.bateria));
      }
    } catch {
      /* cenário salvo inválido — mantém os padrões */
    }
  }, []);

  const submit = () => {
    const payload: CostInput = {
      ...i,
      bateria: comBateria
        ? (i.bateria ?? { capacidade_kWh: 10, custo_RporkWh: 3200, vidaUtil_anos: 10 })
        : null,
    };
    onCalc(payload);
  };

  const salvarCenario = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(i));
      setSalvo("Cenário salvo neste navegador.");
    } catch {
      setSalvo("Não foi possível salvar o cenário.");
    }
    window.setTimeout(() => setSalvo(null), 3000);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="space-y-6"
    >
      <Section title="1 · Projeto">
        <div className="min-w-0">
          <label htmlFor="ce-nome" className="block text-xs font-medium text-muted-foreground">
            Identificação
          </label>
          <input
            id="ce-nome"
            type="text"
            value={i.nome}
            onChange={(e) => set("nome", e.currentTarget.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="ce-local" className="block text-xs font-medium text-muted-foreground">
            Local
          </label>
          <input
            id="ce-local"
            type="text"
            value={i.local}
            onChange={(e) => set("local", e.currentTarget.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>
        <NumField
          label="Potência DC alvo"
          suffix="kWp"
          step={0.1}
          value={i.potenciaAlvo_kWp}
          onChange={(v) => set("potenciaAlvo_kWp", v)}
        />
        <NumField
          label="Produção estimada ano 1"
          suffix="kWh"
          step={100}
          value={i.producaoAnual_kWh}
          onChange={(v) => set("producaoAnual_kWh", v)}
          hint="Use a simulação por localização ou a calculadora de perdas."
        />
        <NumField
          label="Tarifa"
          suffix="R$/kWh"
          step={0.01}
          value={i.tarifa_RporkWh}
          onChange={(v) => set("tarifa_RporkWh", v)}
        />
        <NumField
          label="Degradação anual"
          suffix="%"
          step={0.1}
          value={i.degradacaoAnual_pct}
          onChange={(v) => set("degradacaoAnual_pct", v)}
        />
      </Section>

      <Section title="2 · Equipamento">
        <div className="min-w-0">
          <label htmlFor="ce-preset-mod" className="block text-xs font-medium text-muted-foreground">
            Preset de módulo
          </label>
          <select
            id="ce-preset-mod"
            value={i.modulo.label}
            onChange={(e) => {
              const p = PRESET_MODULOS.find((m) => m.label === e.currentTarget.value);
              if (p) set("modulo", { ...p });
            }}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            {PRESET_MODULOS.map((m) => (
              <option key={m.label} value={m.label}>
                {m.label}
              </option>
            ))}
            {!PRESET_MODULOS.some((m) => m.label === i.modulo.label) && (
              <option value={i.modulo.label}>{i.modulo.label}</option>
            )}
          </select>
        </div>
        <NumField
          label="Potência do módulo"
          suffix="Wp"
          value={i.modulo.pmp_W}
          onChange={(v) => patch("modulo", { pmp_W: v })}
        />
        <NumField
          label="Preço do módulo"
          suffix="R$/Wp"
          step={0.01}
          value={i.modulo.custo_RporWp}
          onChange={(v) => patch("modulo", { custo_RporWp: v })}
        />
        <NumField
          label="Módulos por caixa"
          value={i.modulo.porCaixa}
          onChange={(v) => patch("modulo", { porCaixa: v })}
          hint="A compra é arredondada para caixas fechadas."
        />
        <NumField
          label="Módulos reserva"
          suffix="%"
          step={1}
          value={i.spare_pct}
          onChange={(v) => set("spare_pct", v)}
        />
        <div className="min-w-0">
          <label htmlFor="ce-montagem" className="block text-xs font-medium text-muted-foreground">
            Montagem
          </label>
          <select
            id="ce-montagem"
            value={i.montagem}
            onChange={(e) => set("montagem", e.currentTarget.value as Montagem)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="paisagem">Paisagem (deitado)</option>
            <option value="retrato">Retrato (em pé)</option>
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor="ce-preset-inv" className="block text-xs font-medium text-muted-foreground">
            Preset de inversor
          </label>
          <select
            id="ce-preset-inv"
            value={`${i.inversor.tipo}-${i.inversor.potenciaAC_kW}`}
            onChange={(e) => {
              const p = PRESET_INVERSORES.find(
                (x) => `${x.tipo}-${x.potenciaAC_kW}` === e.currentTarget.value,
              );
              if (p) {
                set("inversor", {
                  tipo: p.tipo,
                  potenciaAC_kW: p.potenciaAC_kW,
                  custoUnitario_R: p.custoUnitario_R,
                  stringsPorInversor: p.stringsPorInversor,
                  vidaUtil_anos: p.vidaUtil_anos,
                });
              }
            }}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            {PRESET_INVERSORES.map((p) => (
              <option key={p.label} value={`${p.tipo}-${p.potenciaAC_kW}`}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <NumField
          label="Custo do inversor"
          suffix="R$/un"
          step={50}
          value={i.inversor.custoUnitario_R}
          onChange={(v) => patch("inversor", { custoUnitario_R: v })}
        />
        <NumField
          label="Vida útil do inversor"
          suffix="anos"
          value={i.inversor.vidaUtil_anos}
          onChange={(v) => patch("inversor", { vidaUtil_anos: v })}
        />
        <NumField
          label="Módulos por string"
          value={i.modulosPorString}
          onChange={(v) => set("modulosPorString", v)}
        />
        <NumField
          label="Entradas de string por inversor"
          value={i.inversor.stringsPorInversor}
          onChange={(v) => patch("inversor", { stringsPorInversor: v })}
        />
        <NumField
          label="DC/AC ratio alvo"
          step={0.05}
          value={i.dcAcRatio}
          onChange={(v) => set("dcAcRatio", v)}
        />
      </Section>

      <Section title="3 · Estrutura e cabos">
        <div className="min-w-0">
          <label htmlFor="ce-estrutura" className="block text-xs font-medium text-muted-foreground">
            Tipo de estrutura
          </label>
          <select
            id="ce-estrutura"
            value={i.estrutura.tipo}
            onChange={(e) => {
              const p = PRESET_ESTRUTURAS.find((x) => x.tipo === e.currentTarget.value);
              if (p) {
                set("estrutura", {
                  tipo: p.tipo,
                  rail_RporM: p.rail_RporM,
                  clampsPorModulo: p.clampsPorModulo,
                  clampUnitario_R: p.clampUnitario_R,
                  fator: p.fator,
                });
              }
            }}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            {PRESET_ESTRUTURAS.map((p) => (
              <option key={p.tipo} value={p.tipo}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <NumField
          label="Perfil / rail"
          suffix="R$/m"
          value={i.estrutura.rail_RporM}
          onChange={(v) => patch("estrutura", { rail_RporM: v })}
        />
        <NumField
          label="Grampo (clamp)"
          suffix="R$/un"
          value={i.estrutura.clampUnitario_R}
          onChange={(v) => patch("estrutura", { clampUnitario_R: v })}
        />
        <NumField
          label="Cabo CC"
          suffix="m"
          value={i.cabos.dc_m}
          onChange={(v) => patch("cabos", { dc_m: v })}
        />
        <NumField
          label="Preço cabo CC"
          suffix="R$/m"
          step={0.5}
          value={i.cabos.dc_RporM}
          onChange={(v) => patch("cabos", { dc_RporM: v })}
        />
        <NumField
          label="Cabo CA"
          suffix="m"
          value={i.cabos.ac_m}
          onChange={(v) => patch("cabos", { ac_m: v })}
        />
        <NumField
          label="Preço cabo CA"
          suffix="R$/m"
          step={0.5}
          value={i.cabos.ac_RporM}
          onChange={(v) => patch("cabos", { ac_RporM: v })}
        />
        <NumField
          label="Eletrocalha / eletroduto"
          suffix="m"
          value={i.cabos.eletrocalha_m}
          onChange={(v) => patch("cabos", { eletrocalha_m: v })}
          hint="0 usa o mesmo comprimento do trecho CA."
        />
        <NumField
          label="Preço eletrocalha"
          suffix="R$/m"
          value={i.cabos.eletrocalha_RporM}
          onChange={(v) => patch("cabos", { eletrocalha_RporM: v })}
        />
      </Section>

      <Section title="4 · Proteções e BOP">
        <NumField
          label="Strings por string box"
          value={i.protecoes.stringsPorStringBox}
          onChange={(v) => patch("protecoes", { stringsPorStringBox: v })}
        />
        <NumField
          label="String box"
          suffix="R$/un"
          value={i.protecoes.stringBox_R}
          onChange={(v) => patch("protecoes", { stringBox_R: v })}
        />
        <NumField
          label="Fusível por string"
          suffix="R$"
          value={i.protecoes.fusivelPorString_R}
          onChange={(v) => patch("protecoes", { fusivelPorString_R: v })}
        />
        <NumField
          label="DPS / SPD CA"
          suffix="R$"
          value={i.protecoes.spd_R}
          onChange={(v) => patch("protecoes", { spd_R: v })}
        />
        <NumField
          label="Quadro de proteção"
          suffix="R$"
          value={i.protecoes.quadroProtecao_R}
          onChange={(v) => patch("protecoes", { quadroProtecao_R: v })}
        />
        <NumField
          label="Aterramento"
          suffix="R$"
          value={i.protecoes.aterramento_R}
          onChange={(v) => patch("protecoes", { aterramento_R: v })}
        />
        <NumField
          label="Transformador"
          suffix="R$"
          value={i.protecoes.transformador_R}
          onChange={(v) => patch("protecoes", { transformador_R: v })}
          hint="0 quando não aplicável."
        />
        <NumField
          label="Medição / smart meter"
          suffix="R$"
          value={i.protecoes.medicao_R}
          onChange={(v) => patch("protecoes", { medicao_R: v })}
        />
      </Section>

      <Section title="5 · Instalação, logística e licenças">
        <div className="min-w-0">
          <label htmlFor="ce-modo-mo" className="block text-xs font-medium text-muted-foreground">
            Modo da mão de obra
          </label>
          <select
            id="ce-modo-mo"
            value={i.maoObra.modo}
            onChange={(e) => patch("maoObra", { modo: e.currentTarget.value as ModoMaoObra })}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="kwp">Custo por kWp</option>
            <option value="horas">Horas × taxa</option>
          </select>
        </div>
        {i.maoObra.modo === "kwp" ? (
          <NumField
            label="Instalação"
            suffix="R$/kWp"
            step={10}
            value={i.maoObra.custo_RporkWp}
            onChange={(v) => patch("maoObra", { custo_RporkWp: v })}
          />
        ) : (
          <>
            <NumField
              label="Horas por kWp"
              step={0.5}
              value={i.maoObra.horasPorkWp}
              onChange={(v) => patch("maoObra", { horasPorkWp: v })}
            />
            <NumField
              label="Taxa horária"
              suffix="R$/h"
              step={5}
              value={i.maoObra.taxaHora_R}
              onChange={(v) => patch("maoObra", { taxaHora_R: v })}
            />
          </>
        )}
        <div className="min-w-0">
          <label htmlFor="ce-modo-log" className="block text-xs font-medium text-muted-foreground">
            Modo do frete
          </label>
          <select
            id="ce-modo-log"
            value={i.logistica.modo}
            onChange={(e) => patch("logistica", { modo: e.currentTarget.value as ModoLogistica })}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="pct">% dos equipamentos</option>
            <option value="km">R$/km × distância</option>
          </select>
        </div>
        {i.logistica.modo === "pct" ? (
          <NumField
            label="Frete"
            suffix="% equipamentos"
            step={0.5}
            value={i.logistica.pctCapex}
            onChange={(v) => patch("logistica", { pctCapex: v })}
          />
        ) : (
          <>
            <NumField
              label="Distância"
              suffix="km"
              value={i.logistica.distancia_km}
              onChange={(v) => patch("logistica", { distancia_km: v })}
            />
            <NumField
              label="Custo por km"
              suffix="R$/km"
              step={0.5}
              value={i.logistica.custo_RporKm}
              onChange={(v) => patch("logistica", { custo_RporKm: v })}
            />
          </>
        )}
        <NumField
          label="Descarregamento"
          suffix="R$"
          step={50}
          value={i.logistica.descarregamento_R}
          onChange={(v) => patch("logistica", { descarregamento_R: v })}
        />
        <NumField
          label="Projeto elétrico e ART"
          suffix="R$"
          step={50}
          value={i.projeto_R}
          onChange={(v) => set("projeto_R", v)}
        />
        <NumField
          label="Licenças e homologação"
          suffix="R$"
          step={50}
          value={i.licencas_R}
          onChange={(v) => set("licencas_R", v)}
        />
        <NumField
          label="Comissionamento"
          suffix="% dos itens"
          step={0.5}
          value={i.comissionamento_pct}
          onChange={(v) => set("comissionamento_pct", v)}
        />
      </Section>

      <Section title="6 · OPEX, substituições e margens">
        <NumField
          label="Limpeza"
          suffix="R$/kWp·ano"
          value={i.opex.limpeza_RporkWpAno}
          onChange={(v) => patch("opex", { limpeza_RporkWpAno: v })}
        />
        <NumField
          label="Manutenção preventiva"
          suffix="R$/kWp·ano"
          value={i.opex.manutencao_RporkWpAno}
          onChange={(v) => patch("opex", { manutencao_RporkWpAno: v })}
        />
        <NumField
          label="Monitoramento"
          suffix="R$/kWp·ano"
          value={i.opex.monitoramento_RporkWpAno}
          onChange={(v) => patch("opex", { monitoramento_RporkWpAno: v })}
        />
        <NumField
          label="Seguro"
          suffix="% CAPEX/ano"
          step={0.1}
          value={i.opex.seguro_pctCapexAno}
          onChange={(v) => patch("opex", { seguro_pctCapexAno: v })}
        />
        <NumField
          label="Garantia estendida"
          suffix="R$/ano"
          step={50}
          value={i.opex.garantiaEstendida_Rano}
          onChange={(v) => patch("opex", { garantiaEstendida_Rano: v })}
        />
        <NumField
          label="Vida útil do sistema"
          suffix="anos"
          value={i.vidaUtil_anos}
          onChange={(v) => set("vidaUtil_anos", v)}
        />
        <NumField
          label="Taxa de desconto"
          suffix="% a.a."
          step={0.5}
          value={i.taxaDesconto_pct}
          onChange={(v) => set("taxaDesconto_pct", v)}
        />
        <NumField
          label="Contingência"
          suffix="% CAPEX"
          step={0.5}
          value={i.contingencia_pct}
          onChange={(v) => set("contingencia_pct", v)}
          hint="Recomendado 5 a 10%."
        />
        <NumField
          label="Markup comercial"
          suffix="%"
          step={1}
          value={i.markup_pct}
          onChange={(v) => set("markup_pct", v)}
        />
      </Section>

      <div className="min-w-0">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={comBateria}
            onChange={(e) => setComBateria(e.currentTarget.checked)}
            className="h-4 w-4 rounded border-input"
          />
          Incluir banco de baterias
        </label>
        {comBateria && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NumField
              label="Capacidade da bateria"
              suffix="kWh"
              step={0.5}
              value={i.bateria?.capacidade_kWh ?? 10}
              onChange={(v) =>
                set("bateria", {
                  capacidade_kWh: v,
                  custo_RporkWh: i.bateria?.custo_RporkWh ?? 3200,
                  vidaUtil_anos: i.bateria?.vidaUtil_anos ?? 10,
                })
              }
            />
            <NumField
              label="Custo da bateria"
              suffix="R$/kWh"
              step={50}
              value={i.bateria?.custo_RporkWh ?? 3200}
              onChange={(v) =>
                set("bateria", {
                  capacidade_kWh: i.bateria?.capacidade_kWh ?? 10,
                  custo_RporkWh: v,
                  vidaUtil_anos: i.bateria?.vidaUtil_anos ?? 10,
                })
              }
            />
            <NumField
              label="Vida útil da bateria"
              suffix="anos"
              value={i.bateria?.vidaUtil_anos ?? 10}
              onChange={(v) =>
                set("bateria", {
                  capacidade_kWh: i.bateria?.capacidade_kWh ?? 10,
                  custo_RporkWh: i.bateria?.custo_RporkWh ?? 3200,
                  vidaUtil_anos: v,
                })
              }
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Calcular custo total
        </button>
        <button
          type="button"
          onClick={salvarCenario}
          className="rounded-md border border-input bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Salvar cenário
        </button>
        <button
          type="button"
          onClick={() => {
            setI(DEFAULT_COST_INPUT);
            setComBateria(false);
          }}
          className="rounded-md border border-input bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Restaurar padrões
        </button>
        {salvo && <span className="text-xs text-muted-foreground">{salvo}</span>}
      </div>
    </form>
  );
}
