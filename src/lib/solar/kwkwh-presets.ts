/**
 * Presets de fator de produção (specific yield) por cidade, PR de referência
 * e módulos típicos. Valores médios de mercado para pré-dimensionamento —
 * espelhados em content/energia-solar/conversor-kw-kwh/presets.json.
 */

export interface CityPreset {
  id: string;
  cidade: string;
  uf: string;
  latitude: number;
  /** Fator padrão com inclinação otimizada (kWh/kWp/ano). */
  fator_default: number;
  fator_min: number;
  fator_max: number;
  /** Horas equivalentes de sol a pleno sol (h/ano). */
  he_ano: number;
}

export const CITY_PRESETS: CityPreset[] = [
  { id: "sp", cidade: "São Paulo", uf: "SP", latitude: -23.55, fator_default: 1500, fator_min: 1400, fator_max: 1700, he_ano: 1745 },
  { id: "rj", cidade: "Rio de Janeiro", uf: "RJ", latitude: -22.91, fator_default: 1550, fator_min: 1500, fator_max: 1750, he_ano: 1802 },
  { id: "bh", cidade: "Belo Horizonte", uf: "MG", latitude: -19.92, fator_default: 1480, fator_min: 1400, fator_max: 1650, he_ano: 1721 },
  { id: "for", cidade: "Fortaleza", uf: "CE", latitude: -3.73, fator_default: 1850, fator_min: 1700, fator_max: 2000, he_ano: 2151 },
  { id: "bsb", cidade: "Brasília", uf: "DF", latitude: -15.79, fator_default: 1700, fator_min: 1600, fator_max: 1850, he_ano: 1977 },
  { id: "cwb", cidade: "Curitiba", uf: "PR", latitude: -25.43, fator_default: 1400, fator_min: 1300, fator_max: 1500, he_ano: 1628 },
  { id: "poa", cidade: "Porto Alegre", uf: "RS", latitude: -30.03, fator_default: 1300, fator_min: 1200, fator_max: 1400, he_ano: 1512 },
];

export interface PRPreset {
  id: string;
  label: string;
  losses_pct: number;
  pr: number;
  descricao: string;
}

export const PR_PRESETS: PRPreset[] = [
  { id: "conservador", label: "Conservador", losses_pct: 25, pr: 0.75, descricao: "Sombreamento parcial, sujidade alta ou manutenção irregular." },
  { id: "padrao", label: "Padrão", losses_pct: 14, pr: 0.86, descricao: "Instalação bem executada, limpeza periódica, sem sombras relevantes." },
  { id: "otimista", label: "Otimista", losses_pct: 10, pr: 0.9, descricao: "Usina nova, ventilada, monitorada e com limpeza frequente." },
];

export interface ModulePreset {
  id: string;
  label: string;
  potencia_W: number;
  area_m2: number;
  eficiencia_pct: number;
}

export const MODULE_PRESETS: ModulePreset[] = [
  { id: "m400", label: "400 W (monocristalino)", potencia_W: 400, area_m2: 1.95, eficiencia_pct: 20.5 },
  { id: "m450", label: "450 W (monocristalino)", potencia_W: 450, area_m2: 2.1, eficiencia_pct: 21.4 },
  { id: "m550", label: "550 W (half-cell)", potencia_W: 550, area_m2: 2.58, eficiencia_pct: 21.3 },
  { id: "m610", label: "610 W (N-type)", potencia_W: 610, area_m2: 2.79, eficiencia_pct: 21.9 },
];

export interface ExamplePreset {
  id: string;
  titulo: string;
  descricao: string;
  modo: "kwp-to-kwh" | "kwh-to-kwp";
  valor: number;
  cidadeId: string;
  fator: number;
  losses_pct: number;
  modulo_W: number;
}

export const EXAMPLE_PRESETS: ExamplePreset[] = [
  {
    id: "residencial",
    titulo: "Residencial · 5 kWp em São Paulo",
    descricao: "5 kWp × 1.500 kWh/kWp/ano × 0,86 = 6.450 kWh/ano.",
    modo: "kwp-to-kwh",
    valor: 5,
    cidadeId: "sp",
    fator: 1500,
    losses_pct: 14,
    modulo_W: 550,
  },
  {
    id: "comercial",
    titulo: "Comercial · meta de 9.000 kWh/ano em Fortaleza",
    descricao: "9.000 ÷ (1.850 × 0,86) ≈ 5,66 kWp → sugerir 5,7 kWp.",
    modo: "kwh-to-kwp",
    valor: 9000,
    cidadeId: "for",
    fator: 1850,
    losses_pct: 14,
    modulo_W: 550,
  },
  {
    id: "groundmount",
    titulo: "Solo · 100 kWp em Brasília",
    descricao: "100 kWp × 1.700 kWh/kWp/ano × 0,86 = 146.200 kWh/ano.",
    modo: "kwp-to-kwh",
    valor: 100,
    cidadeId: "bsb",
    fator: 1700,
    losses_pct: 14,
    modulo_W: 610,
  },
];
