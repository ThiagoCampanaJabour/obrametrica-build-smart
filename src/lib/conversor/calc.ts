/**
 * Funções puras de conversão, parsing de entrada e formatação de saída.
 * Nenhuma dependência externa: o parser é um recursive-descent mínimo que
 * aceita apenas números, parênteses e os operadores + - * / ^, evitando
 * qualquer risco de injeção (nunca usamos eval/Function).
 */

import { findUnit, type Unit } from "./units";

export class ConversionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConversionError";
  }
}

/* ------------------------------------------------------------------ */
/* Parsing                                                             */
/* ------------------------------------------------------------------ */

/**
 * Avalia uma expressão aritmética simples.
 * Suporta: números decimais, notação científica (1.2e3), vírgula decimal
 * pt-BR, parênteses, + - * / ^ e o símbolo × / ÷.
 */
export function parseInput(raw: string): number {
  const input = raw.trim();
  if (input === "") throw new ConversionError("Informe um valor.");

  const normalized = input
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/\s+/g, "")
    // vírgula como separador decimal (não há listas na gramática)
    .replace(/,/g, ".");

  if (!/^[0-9.eE+\-*/^()]+$/.test(normalized)) {
    throw new ConversionError("Expressão inválida. Use apenas números e + - * / ( ).");
  }

  let pos = 0;

  const peek = () => normalized[pos];

  function parseNumber(): number {
    const match = /^\d*\.?\d+(?:[eE][+-]?\d+)?/.exec(normalized.slice(pos));
    if (!match) throw new ConversionError("Número inválido na expressão.");
    pos += match[0].length;
    return Number(match[0]);
  }

  function parsePrimary(): number {
    const ch = peek();
    if (ch === "(") {
      pos += 1;
      const value = parseExpression();
      if (peek() !== ")") throw new ConversionError("Parêntese não fechado.");
      pos += 1;
      return value;
    }
    if (ch === "-") {
      pos += 1;
      return -parsePrimary();
    }
    if (ch === "+") {
      pos += 1;
      return parsePrimary();
    }
    return parseNumber();
  }

  function parsePower(): number {
    const base = parsePrimary();
    if (peek() === "^") {
      pos += 1;
      return Math.pow(base, parsePower());
    }
    return base;
  }

  function parseTerm(): number {
    let value = parsePower();
    while (peek() === "*" || peek() === "/") {
      const op = peek();
      pos += 1;
      const rhs = parsePower();
      if (op === "/") {
        if (rhs === 0) throw new ConversionError("Divisão por zero.");
        value /= rhs;
      } else {
        value *= rhs;
      }
    }
    return value;
  }

  function parseExpression(): number {
    let value = parseTerm();
    while (peek() === "+" || peek() === "-") {
      const op = peek();
      pos += 1;
      const rhs = parseTerm();
      value = op === "+" ? value + rhs : value - rhs;
    }
    return value;
  }

  const result = parseExpression();
  if (pos !== normalized.length) throw new ConversionError("Expressão inválida.");
  if (!Number.isFinite(result)) throw new ConversionError("Resultado numérico inválido.");
  return result;
}

/* ------------------------------------------------------------------ */
/* Conversão                                                           */
/* ------------------------------------------------------------------ */

/** Converte um valor da unidade base da categoria para a unidade informada. */
function fromBase(base: number, unit: Unit): number {
  if (unit.id === "pct") return Math.tan((base * Math.PI) / 180) * 100;
  return (base - (unit.offset ?? 0)) / unit.factor;
}

/** Converte um valor de uma unidade para a unidade base da sua categoria. */
function toBase(value: number, unit: Unit): number {
  if (unit.id === "pct") return (Math.atan(value / 100) * 180) / Math.PI;
  return value * unit.factor + (unit.offset ?? 0);
}

/**
 * Conversão principal. Lança ConversionError para unidades desconhecidas ou
 * dimensionalmente incompatíveis (ex.: metro → quilograma).
 */
export function convert(value: number, fromUnitId: string, toUnitId: string): number {
  if (!Number.isFinite(value)) throw new ConversionError("Valor numérico inválido.");
  const from = findUnit(fromUnitId);
  const to = findUnit(toUnitId);
  if (!from) throw new ConversionError(`Unidade desconhecida: ${fromUnitId}.`);
  if (!to) throw new ConversionError(`Unidade desconhecida: ${toUnitId}.`);
  if (from.category !== to.category) {
    throw new ConversionError(
      `Não é possível converter ${from.symbol} para ${to.symbol}: grandezas diferentes.`,
    );
  }
  if (from.id === to.id) return value;
  return fromBase(toBase(value, from), to);
}

/**
 * Conversão composta por multiplicação/divisão de grandezas.
 * Ex.: 2 m³ × 7850 kg/m³ → kg   |   1000 kg ÷ 2 m³ → kg/m³
 */
export function combine(
  a: { value: number; unitId: string },
  b: { value: number; unitId: string },
  op: "multiply" | "divide",
): number {
  const ua = findUnit(a.unitId);
  const ub = findUnit(b.unitId);
  if (!ua || !ub) throw new ConversionError("Unidade desconhecida na operação composta.");
  const baseA = toBase(a.value, ua);
  const baseB = toBase(b.value, ub);
  if (op === "divide") {
    if (baseB === 0) throw new ConversionError("Divisão por zero.");
    return baseA / baseB;
  }
  return baseA * baseB;
}

/* ------------------------------------------------------------------ */
/* Formatação                                                          */
/* ------------------------------------------------------------------ */

export interface FormatOptions {
  /** Casas decimais (modo Rápido = 3, Preciso = 8 por padrão). */
  decimals?: number;
  /** Força notação científica independente da magnitude. */
  scientific?: boolean;
  /** Locale usado na formatação. CSV pode usar "en-US". */
  locale?: string;
}

const SCI_UPPER = 1e6;
const SCI_LOWER = 1e-3;

/** Formata o resultado respeitando locale pt-BR e notação científica. */
export function formatOutput(value: number, options: FormatOptions = {}): string {
  const { decimals = 3, scientific = false, locale = "pt-BR" } = options;
  if (!Number.isFinite(value)) return "—";

  const abs = Math.abs(value);
  const needsScientific = scientific || (abs !== 0 && (abs >= SCI_UPPER || abs < SCI_LOWER));

  if (needsScientific) {
    const exponential = value.toExponential(Math.min(decimals, 15));
    return locale === "pt-BR" ? exponential.replace(".", ",") : exponential;
  }

  return value.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
    useGrouping: locale === "pt-BR",
  });
}

/* ------------------------------------------------------------------ */
/* Histórico                                                           */
/* ------------------------------------------------------------------ */

export const HISTORY_VERSION = 1;

export interface HistoryEntry {
  id: string;
  timestamp: number;
  category: string;
  input: string;
  valueFrom: number;
  fromUnit: string;
  toUnit: string;
  result: number;
}

export function historyToJSON(entries: HistoryEntry[]): string {
  return JSON.stringify({ version: HISTORY_VERSION, entries }, null, 2);
}

export function historyToCSV(entries: HistoryEntry[], locale = "en-US"): string {
  const header = "data;categoria;entrada;valor;unidade_origem;unidade_destino;resultado";
  const rows = entries.map((entry) =>
    [
      new Date(entry.timestamp).toISOString(),
      entry.category,
      entry.input.replace(/;/g, ","),
      formatOutput(entry.valueFrom, { decimals: 8, locale }),
      entry.fromUnit,
      entry.toUnit,
      formatOutput(entry.result, { decimals: 8, locale }),
    ].join(";"),
  );
  return [header, ...rows].join("\n");
}
