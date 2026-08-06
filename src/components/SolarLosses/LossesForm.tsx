import { useState } from "react";
import type { SolarLossesInput } from "@/lib/solar/calc";
import { DEFAULT_INPUT } from "@/lib/solar/calc";

interface FieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  suffix?: string;
  hint?: string;
}

function NumField({ label, value, onChange, step = 0.1, min, suffix, hint }: FieldProps) {
  const id = label.replace(/\W+/g, "-").toLowerCase();
  return (
    <div>
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

export function LossesForm({ onCalc }: { onCalc: (input: SolarLossesInput) => void }) {
  const [i, setI] = useState<SolarLossesInput>(DEFAULT_INPUT);
  const [avancado, setAvancado] = useState(false);
  const set = <K extends keyof SolarLossesInput>(k: K, v: SolarLossesInput[K]) =>
    setI((p) => ({ ...p, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCalc(i);
      }}
      className="space-y-6"
    >
      <fieldset>
        <legend className="text-sm font-semibold text-foreground">Input rápido</legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <NumField
            label="Energia teórica DC"
            suffix="kWh/ano"
            step={100}
            min={0}
            value={i.energiaTeoricaDc_kWh}
            onChange={(v) => set("energiaTeoricaDc_kWh", v)}
            hint="Use o resultado do simulador de radiação."
          />
          <NumField
            label="Potência DC instalada"
            suffix="kWp"
            step={0.1}
            min={0}
            value={i.potenciaDc_kWp}
            onChange={(v) => set("potenciaDc_kWp", v)}
          />
          <NumField
            label="Potência AC do inversor"
            suffix="kW"
            step={0.1}
            min={0}
            value={i.potenciaAc_kW}
            onChange={(v) => set("potenciaAc_kW", v)}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-foreground">Temperatura</legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <NumField
            label="Coeficiente térmico"
            suffix="%/°C"
            step={0.01}
            value={i.coefTermico_pctPerC}
            onChange={(v) => set("coefTermico_pctPerC", v)}
          />
          {i.usarTempCelulaManual ? (
            <NumField
              label="Temperatura de célula"
              suffix="°C"
              step={1}
              value={i.tempCelulaManual_C}
              onChange={(v) => set("tempCelulaManual_C", v)}
            />
          ) : (
            <>
              <NumField
                label="Temperatura ambiente média"
                suffix="°C"
                step={1}
                value={i.tempAmbiente_C}
                onChange={(v) => set("tempAmbiente_C", v)}
              />
              <NumField
                label="NOCT do módulo"
                suffix="°C"
                step={1}
                value={i.noct_C}
                onChange={(v) => set("noct_C", v)}
              />
            </>
          )}
        </div>
        <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={i.usarTempCelulaManual}
            onChange={(e) => set("usarTempCelulaManual", e.currentTarget.checked)}
          />
          Informar temperatura de célula manualmente
        </label>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-foreground">Perdas do sistema</legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <NumField
            label="Sombreamento"
            suffix="%"
            min={0}
            value={i.sombreamento_pct}
            onChange={(v) => set("sombreamento_pct", v)}
          />
          <NumField
            label="Sujidade (soiling)"
            suffix="%"
            min={0}
            value={i.soiling_pct}
            onChange={(v) => set("soiling_pct", v)}
            hint="Urbano 2% · Rural 4% · Árido 8–10%"
          />
          <NumField
            label="Mismatch"
            suffix="%"
            min={0}
            value={i.mismatch_pct}
            onChange={(v) => set("mismatch_pct", v)}
          />
          <NumField
            label="Eficiência do inversor"
            suffix="%"
            min={1}
            value={i.eficienciaInversor_pct}
            onChange={(v) => set("eficienciaInversor_pct", v)}
          />
          <NumField
            label="Perdas AC / BOS"
            suffix="%"
            min={0}
            value={i.perdasAc_pct}
            onChange={(v) => set("perdasAc_pct", v)}
          />
          <NumField
            label="Margem de segurança"
            suffix="%"
            min={0}
            value={i.margemSeguranca_pct}
            onChange={(v) => set("margemSeguranca_pct", v)}
          />
        </div>
      </fieldset>

      <button
        type="button"
        onClick={() => setAvancado((v) => !v)}
        className="text-xs font-medium text-foreground underline"
      >
        {avancado ? "Ocultar" : "Configurar"} detalhes avançados (cabos, clipping, degradação)
      </button>

      {avancado && (
        <fieldset className="rounded-lg border border-border bg-muted/30 p-4">
          <legend className="px-1 text-sm font-semibold text-foreground">Avançado</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="cabos-modo" className="block text-xs font-medium text-muted-foreground">
                Cabos DC — modo
              </label>
              <select
                id="cabos-modo"
                value={i.cabosModo}
                onChange={(e) =>
                  set("cabosModo", e.currentTarget.value as SolarLossesInput["cabosModo"])
                }
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="percentual">Percentual</option>
                <option value="resistivo">Resistivo (I²R)</option>
              </select>
            </div>
            {i.cabosModo === "percentual" ? (
              <NumField
                label="Perda em cabos DC"
                suffix="%"
                min={0}
                value={i.cabosDc_pct}
                onChange={(v) => set("cabosDc_pct", v)}
              />
            ) : (
              <>
                <NumField
                  label="Corrente de operação"
                  suffix="A"
                  min={0}
                  value={i.correnteOperacao_A}
                  onChange={(v) => set("correnteOperacao_A", v)}
                />
                <NumField
                  label="Resistência total"
                  suffix="Ω"
                  step={0.01}
                  min={0}
                  value={i.resistenciaTotal_ohm}
                  onChange={(v) => set("resistenciaTotal_ohm", v)}
                />
                <NumField
                  label="Horas equivalentes"
                  suffix="h/ano"
                  step={10}
                  min={0}
                  value={i.horasEquivalentes_h}
                  onChange={(v) => set("horasEquivalentes_h", v)}
                />
              </>
            )}
            <div>
              <label htmlFor="clip-modo" className="block text-xs font-medium text-muted-foreground">
                Clipping
              </label>
              <select
                id="clip-modo"
                value={i.clippingModo}
                onChange={(e) =>
                  set("clippingModo", e.currentTarget.value as SolarLossesInput["clippingModo"])
                }
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="auto">Automático (DC/AC ratio)</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            {i.clippingModo === "manual" && (
              <NumField
                label="Clipping"
                suffix="%"
                min={0}
                value={i.clipping_pct}
                onChange={(v) => set("clipping_pct", v)}
              />
            )}
            <NumField
              label="Degradação anual"
              suffix="%"
              step={0.05}
              min={0}
              value={i.degradacaoAnual_pct}
              onChange={(v) => set("degradacaoAnual_pct", v)}
            />
            <NumField
              label="Horizonte"
              suffix="anos"
              step={1}
              min={1}
              value={i.horizonteAnos}
              onChange={(v) => set("horizonteAnos", v)}
            />
          </div>
        </fieldset>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Calcular perdas e eficiência
        </button>
        <button
          type="button"
          onClick={() => setI(DEFAULT_INPUT)}
          className="rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          Restaurar padrões
        </button>
      </div>
    </form>
  );
}
