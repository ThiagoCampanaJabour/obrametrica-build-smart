/**
 * Definição de categorias, unidades e fatores de conversão.
 *
 * Estratégia: toda unidade é descrita por um fator multiplicativo em relação
 * à unidade base (SI) da sua categoria, mais um deslocamento opcional
 * (necessário apenas para temperatura). A conversão sempre passa pela base:
 *
 *   base = valor * factor + offset
 *   destino = (base - offset_destino) / factor_destino
 *
 * Fontes dos fatores: SI (BIPM), NIST SP 811 e ISO 80000.
 */

export type CategoryId =
  | "comprimento"
  | "area"
  | "volume"
  | "massa"
  | "densidade"
  | "forca"
  | "pressao"
  | "energia"
  | "potencia"
  | "temperatura"
  | "velocidade"
  | "vazao"
  | "fluxo-massa"
  | "torque"
  | "angulo"
  | "eletricidade";

export interface Unit {
  /** Identificador único e estável (usado no histórico em localStorage). */
  id: string;
  /** Símbolo exibido, ex.: "kg/m³". */
  symbol: string;
  /** Nome por extenso em pt-BR. */
  name: string;
  category: CategoryId;
  /** Fator multiplicativo em relação à unidade base da categoria. */
  factor: number;
  /** Deslocamento aplicado após o fator (apenas temperatura). */
  offset?: number;
  /** Termos extras de busca (sinônimos, grafias alternativas). */
  aliases?: string[];
}

export interface Category {
  id: CategoryId;
  name: string;
  /** Unidade base (SI) da categoria. */
  base: string;
  /** Descrição curta usada na UI. */
  description: string;
}

export const CATEGORIES: Category[] = [
  { id: "comprimento", name: "Comprimento", base: "m", description: "Distâncias e dimensões lineares" },
  { id: "area", name: "Área", base: "m2", description: "Superfícies e seções de perfis" },
  { id: "volume", name: "Volume", base: "m3", description: "Concreto, agregados e líquidos" },
  { id: "massa", name: "Massa", base: "kg", description: "Peso de materiais e cargas" },
  { id: "densidade", name: "Densidade", base: "kg_m3", description: "Massa específica de materiais" },
  { id: "forca", name: "Força", base: "N", description: "Cargas concentradas e reações" },
  { id: "pressao", name: "Pressão / Tensão", base: "Pa", description: "Tensões, resistências e pressões" },
  { id: "energia", name: "Energia", base: "J", description: "Consumo elétrico e calor" },
  { id: "potencia", name: "Potência", base: "W", description: "Equipamentos, HVAC e geração" },
  { id: "temperatura", name: "Temperatura", base: "C", description: "Conforto térmico e cura" },
  { id: "velocidade", name: "Velocidade", base: "m_s", description: "Vento e escoamento" },
  { id: "vazao", name: "Vazão", base: "m3_s", description: "Drenagem, calhas e hidráulica" },
  { id: "fluxo-massa", name: "Fluxo de massa", base: "kg_s", description: "Transporte de materiais" },
  { id: "torque", name: "Torque / Momento", base: "Nm", description: "Momentos fletores e aperto" },
  { id: "angulo", name: "Ângulo", base: "deg", description: "Inclinações de telhado e rampas" },
  { id: "eletricidade", name: "Eletricidade", base: "V", description: "Tensão, corrente e resistência" },
];

const u = (
  id: string,
  symbol: string,
  name: string,
  category: CategoryId,
  factor: number,
  aliases?: string[],
  offset?: number,
): Unit => ({ id, symbol, name, category, factor, aliases, offset });

export const UNITS: Unit[] = [
  // Comprimento (base: metro)
  u("m", "m", "metro", "comprimento", 1, ["metro", "metros"]),
  u("cm", "cm", "centímetro", "comprimento", 0.01, ["centimetro"]),
  u("mm", "mm", "milímetro", "comprimento", 0.001, ["milimetro"]),
  u("km", "km", "quilômetro", "comprimento", 1000, ["quilometro"]),
  u("in", "in", "polegada", "comprimento", 0.0254, ["polegada", '"']),
  u("ft", "ft", "pé", "comprimento", 0.3048, ["pe", "feet", "foot"]),
  u("yd", "yd", "jarda", "comprimento", 0.9144, ["jarda", "yard"]),

  // Área (base: metro quadrado)
  u("m2", "m²", "metro quadrado", "area", 1, ["m2", "metro quadrado"]),
  u("cm2", "cm²", "centímetro quadrado", "area", 1e-4, ["cm2"]),
  u("mm2", "mm²", "milímetro quadrado", "area", 1e-6, ["mm2", "seção", "secao", "armadura"]),
  u("ha", "ha", "hectare", "area", 1e4, ["hectare"]),
  u("ft2", "ft²", "pé quadrado", "area", 0.09290304, ["ft2", "sqft"]),
  u("in2", "in²", "polegada quadrada", "area", 6.4516e-4, ["in2", "sqin"]),

  // Volume (base: metro cúbico)
  u("m3", "m³", "metro cúbico", "volume", 1, ["m3", "metro cubico", "concreto"]),
  u("L", "L", "litro", "volume", 0.001, ["litro", "litros", "l"]),
  u("mL", "mL", "mililitro", "volume", 1e-6, ["mililitro", "ml"]),
  u("cm3", "cm³", "centímetro cúbico", "volume", 1e-6, ["cm3", "cc"]),
  u("ft3", "ft³", "pé cúbico", "volume", 0.028316846592, ["ft3", "cuft"]),
  u("in3", "in³", "polegada cúbica", "volume", 1.6387064e-5, ["in3"]),

  // Massa (base: quilograma)
  u("kg", "kg", "quilograma", "massa", 1, ["quilo", "quilograma", "kilo"]),
  u("g", "g", "grama", "massa", 0.001, ["grama"]),
  u("mg", "mg", "miligrama", "massa", 1e-6, ["miligrama"]),
  u("t", "t", "tonelada", "massa", 1000, ["tonelada", "ton"]),
  u("lb", "lb", "libra", "massa", 0.45359237, ["libra", "lbm", "pound"]),
  u("oz", "oz", "onça", "massa", 0.028349523125, ["onca", "ounce"]),

  // Densidade (base: kg/m³)
  u("kg_m3", "kg/m³", "quilograma por metro cúbico", "densidade", 1, ["kg/m3", "massa especifica"]),
  u("g_cm3", "g/cm³", "grama por centímetro cúbico", "densidade", 1000, ["g/cm3"]),
  u("kg_L", "kg/L", "quilograma por litro", "densidade", 1000, ["kg/l"]),
  u("t_m3", "t/m³", "tonelada por metro cúbico", "densidade", 1000, ["t/m3"]),
  u("lb_ft3", "lb/ft³", "libra por pé cúbico", "densidade", 16.018463373960142, ["lb/ft3", "pcf"]),

  // Força (base: newton)
  u("N", "N", "newton", "forca", 1, ["newton"]),
  u("kN", "kN", "quilonewton", "forca", 1000, ["quilonewton"]),
  u("MN", "MN", "meganewton", "forca", 1e6, ["meganewton"]),
  u("kgf", "kgf", "quilograma-força", "forca", 9.80665, ["kgf", "kilograma forca"]),
  u("tf", "tf", "tonelada-força", "forca", 9806.65, ["tonelada forca"]),
  u("lbf", "lbf", "libra-força", "forca", 4.4482216152605, ["libra forca"]),

  // Pressão / Tensão (base: pascal)
  u("Pa", "Pa", "pascal", "pressao", 1, ["pascal", "n/m2", "n/m²"]),
  u("kPa", "kPa", "quilopascal", "pressao", 1000, ["quilopascal"]),
  u("MPa", "MPa", "megapascal", "pressao", 1e6, ["megapascal", "fck", "n/mm2"]),
  u("GPa", "GPa", "gigapascal", "pressao", 1e9, ["gigapascal"]),
  u("bar", "bar", "bar", "pressao", 1e5, ["bar"]),
  u("mbar", "mbar", "milibar", "pressao", 100, ["milibar"]),
  u("kgf_cm2", "kgf/cm²", "quilograma-força por cm²", "pressao", 98066.5, ["kgf/cm2"]),
  u("psi", "psi", "libra por polegada quadrada", "pressao", 6894.757293168361, ["psi", "lb/in2"]),
  u("mca", "mca", "metro de coluna d'água", "pressao", 9806.65, ["mca", "coluna dagua"]),
  u("atm", "atm", "atmosfera", "pressao", 101325, ["atmosfera"]),

  // Energia (base: joule)
  u("J", "J", "joule", "energia", 1, ["joule"]),
  u("kJ", "kJ", "quilojoule", "energia", 1000, ["quilojoule"]),
  u("MJ", "MJ", "megajoule", "energia", 1e6, ["megajoule"]),
  u("Wh", "Wh", "watt-hora", "energia", 3600, ["watt hora"]),
  u("kWh", "kWh", "quilowatt-hora", "energia", 3.6e6, ["quilowatt hora", "energia eletrica"]),
  u("cal", "cal", "caloria", "energia", 4.184, ["caloria"]),
  u("kcal", "kcal", "quilocaloria", "energia", 4184, ["quilocaloria"]),
  u("BTU", "BTU", "British Thermal Unit", "energia", 1055.05585262, ["btu"]),

  // Potência (base: watt)
  u("W", "W", "watt", "potencia", 1, ["watt"]),
  u("kW", "kW", "quilowatt", "potencia", 1000, ["quilowatt"]),
  u("MW", "MW", "megawatt", "potencia", 1e6, ["megawatt"]),
  u("cv", "cv", "cavalo-vapor", "potencia", 735.49875, ["cavalo vapor", "cv"]),
  u("hp", "hp", "horsepower (mecânico)", "potencia", 745.6998715822702, ["hp", "horsepower"]),
  u("BTU_h", "BTU/h", "BTU por hora", "potencia", 0.29307107017222, ["btu/h", "ar condicionado"]),
  u("TR", "TR", "tonelada de refrigeração", "potencia", 3516.8528420667, ["tr", "ton refrigeracao"]),

  // Temperatura (base: °C — offset aplicado após o fator)
  u("C", "°C", "grau Celsius", "temperatura", 1, ["celsius", "c"], 0),
  u("K", "K", "kelvin", "temperatura", 1, ["kelvin"], -273.15),
  u("F", "°F", "grau Fahrenheit", "temperatura", 5 / 9, ["fahrenheit", "f"], (-32 * 5) / 9),

  // Velocidade (base: m/s)
  u("m_s", "m/s", "metro por segundo", "velocidade", 1, ["m/s"]),
  u("km_h", "km/h", "quilômetro por hora", "velocidade", 1 / 3.6, ["km/h", "kmh"]),
  u("ft_s", "ft/s", "pé por segundo", "velocidade", 0.3048, ["ft/s"]),
  u("mph", "mph", "milha por hora", "velocidade", 0.44704, ["mph", "milha"]),

  // Vazão (base: m³/s)
  u("m3_s", "m³/s", "metro cúbico por segundo", "vazao", 1, ["m3/s"]),
  u("m3_h", "m³/h", "metro cúbico por hora", "vazao", 1 / 3600, ["m3/h"]),
  u("L_s", "L/s", "litro por segundo", "vazao", 0.001, ["l/s", "drenagem"]),
  u("L_min", "L/min", "litro por minuto", "vazao", 0.001 / 60, ["l/min"]),
  u("L_h", "L/h", "litro por hora", "vazao", 0.001 / 3600, ["l/h"]),

  // Fluxo de massa (base: kg/s)
  u("kg_s", "kg/s", "quilograma por segundo", "fluxo-massa", 1, ["kg/s"]),
  u("kg_h", "kg/h", "quilograma por hora", "fluxo-massa", 1 / 3600, ["kg/h"]),
  u("t_h", "t/h", "tonelada por hora", "fluxo-massa", 1000 / 3600, ["t/h"]),

  // Torque / Momento (base: N·m)
  u("Nm", "N·m", "newton-metro", "torque", 1, ["n.m", "nm"]),
  u("kNm", "kN·m", "quilonewton-metro", "torque", 1000, ["kn.m", "knm", "momento fletor"]),
  u("kgfm", "kgf·m", "quilograma-força metro", "torque", 9.80665, ["kgf.m"]),
  u("tfm", "tf·m", "tonelada-força metro", "torque", 9806.65, ["tf.m"]),
  u("lbft", "lb·ft", "libra-pé", "torque", 1.3558179483314004, ["lb.ft", "libra pe"]),

  // Ângulo (base: grau)
  u("deg", "°", "grau", "angulo", 1, ["grau", "graus", "deg"]),
  u("rad", "rad", "radiano", "angulo", 180 / Math.PI, ["radiano"]),
  u("grad", "gon", "grado", "angulo", 0.9, ["grado", "gon"]),
  u("pct", "%", "inclinação percentual", "angulo", NaN, ["porcentagem", "caimento", "inclinacao"]),

  // Eletricidade (base: volt — categoria agrupa grandezas de mesma dimensão)
  u("V", "V", "volt", "eletricidade", 1, ["volt", "tensao eletrica"]),
  u("kV", "kV", "quilovolt", "eletricidade", 1000, ["quilovolt"]),
  u("mV", "mV", "milivolt", "eletricidade", 0.001, ["milivolt"]),
];

export const UNITS_BY_ID: Record<string, Unit> = Object.fromEntries(
  UNITS.map((unit) => [unit.id, unit]),
);

export function unitsOf(category: CategoryId): Unit[] {
  return UNITS.filter((unit) => unit.category === category);
}

export function findUnit(id: string): Unit | undefined {
  return UNITS_BY_ID[id];
}

/** Busca textual tolerante por símbolo, nome ou alias. */
export function searchUnits(query: string, category?: CategoryId): Unit[] {
  const pool = category ? unitsOf(category) : UNITS;
  const q = query.trim().toLowerCase();
  if (!q) return pool;
  return pool.filter((unit) => {
    const haystack = [unit.symbol, unit.name, unit.id, ...(unit.aliases ?? [])]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
