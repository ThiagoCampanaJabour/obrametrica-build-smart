import { useState } from "react";
import {
  UFS,
  ufFromCEP,
  normalizeCEP,
  type ClasseConsumidor,
  type Estimate,
} from "@/lib/solar/incentives";

const CLASSES: ReadonlyArray<{ value: ClasseConsumidor; label: string }> = [
  { value: "residencial", label: "Residencial" },
  { value: "comercial", label: "Comercial" },
  { value: "industrial", label: "Industrial" },
  { value: "rural", label: "Rural" },
  { value: "condominio", label: "Condomínio" },
];

const inputClass =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent";
const labelClass = "block text-xs font-medium text-muted-foreground";

export interface SearchLocationProps {
  value: Estimate;
  onChange: (next: Estimate) => void;
}

export function SearchLocation({ value, onChange }: SearchLocationProps) {
  const [cep, setCep] = useState("");
  const [cepMsg, setCepMsg] = useState<string | null>(null);

  const set = <K extends keyof Estimate>(key: K, v: Estimate[K]) =>
    onChange({ ...value, [key]: v });

  const buscarCep = () => {
    const norm = normalizeCEP(cep);
    if (!norm) {
      setCepMsg("Informe um CEP com 8 dígitos (ex.: 01310-100).");
      return;
    }
    const uf = ufFromCEP(norm);
    if (!uf) {
      setCepMsg("Não foi possível identificar a UF deste CEP. Selecione manualmente.");
      return;
    }
    setCepMsg(`CEP ${norm.slice(0, 5)}-${norm.slice(5)} → UF ${uf}. Ajuste o município se necessário.`);
    onChange({ ...value, uf });
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-base font-semibold text-foreground">1. Localidade e projeto</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Busque pelo CEP ou selecione a UF e o município. Você pode forçar outra localidade para
        comparar oportunidades entre regiões.
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <label className={labelClass} htmlFor="inc-cep">
            CEP (Brasil)
          </label>
          <input
            id="inc-cep"
            inputMode="numeric"
            maxLength={9}
            placeholder="01310-100"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            className={inputClass}
          />
        </div>
        <button
          type="button"
          onClick={buscarCep}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Buscar
        </button>
      </div>
      {cepMsg && <p className="mt-2 text-xs text-muted-foreground">{cepMsg}</p>}

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="min-w-0">
          <label className={labelClass} htmlFor="inc-uf">
            Estado (UF)
          </label>
          <select
            id="inc-uf"
            value={value.uf}
            onChange={(e) => set("uf", e.target.value)}
            className={inputClass}
          >
            {UFS.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0">
          <label className={labelClass} htmlFor="inc-mun">
            Município
          </label>
          <input
            id="inc-mun"
            value={value.municipio}
            onChange={(e) => set("municipio", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="min-w-0">
          <label className={labelClass} htmlFor="inc-classe">
            Classe de consumo
          </label>
          <select
            id="inc-classe"
            value={value.classe}
            onChange={(e) => set("classe", e.target.value as ClasseConsumidor)}
            className={inputClass}
          >
            {CLASSES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0">
          <label className={labelClass} htmlFor="inc-kwp">
            Potência (kWp)
          </label>
          <input
            id="inc-kwp"
            type="number"
            min={0}
            step={0.1}
            value={value.potencia_kWp}
            onChange={(e) => set("potencia_kWp", Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div className="min-w-0">
          <label className={labelClass} htmlFor="inc-capex">
            CAPEX total (R$)
          </label>
          <input
            id="inc-capex"
            type="number"
            min={0}
            step={100}
            value={value.capex_R}
            onChange={(e) => set("capex_R", Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div className="min-w-0">
          <label className={labelClass} htmlFor="inc-opex">
            OPEX anual (R$)
          </label>
          <input
            id="inc-opex"
            type="number"
            min={0}
            step={50}
            value={value.opexAnual_R}
            onChange={(e) => set("opexAnual_R", Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div className="min-w-0">
          <label className={labelClass} htmlFor="inc-prod">
            Produção anual (kWh)
          </label>
          <input
            id="inc-prod"
            type="number"
            min={0}
            step={100}
            value={value.producaoAnual_kWh}
            onChange={(e) => set("producaoAnual_kWh", Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div className="min-w-0">
          <label className={labelClass} htmlFor="inc-tarifa">
            Tarifa (R$/kWh)
          </label>
          <input
            id="inc-tarifa"
            type="number"
            min={0}
            step={0.01}
            value={value.tarifa_RporkWh}
            onChange={(e) => set("tarifa_RporkWh", Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div className="min-w-0">
          <label className={labelClass} htmlFor="inc-data">
            Data prevista de instalação
          </label>
          <input
            id="inc-data"
            type="date"
            value={value.dataInstalacao}
            onChange={(e) => set("dataInstalacao", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </section>
  );
}
