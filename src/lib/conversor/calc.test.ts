import { describe, it, expect } from "vitest";
import { convert, combine, parseInput, formatOutput, historyToCSV, ConversionError } from "./calc";

describe("parseInput", () => {
  it("aceita notação científica", () => {
    expect(parseInput("2.5e3")).toBe(2500);
    expect(parseInput("1.2e3/1000")).toBeCloseTo(1.2, 10);
  });

  it("aceita expressões com parênteses e precedência", () => {
    expect(parseInput("3 * (2 + 1)")).toBe(9);
    expect(parseInput("2 + 3 * 4")).toBe(14);
    expect(parseInput("2^3")).toBe(8);
  });

  it("aceita vírgula decimal pt-BR e negativos", () => {
    expect(parseInput("2,5")).toBe(2.5);
    expect(parseInput("-10")).toBe(-10);
  });

  it("rejeita entradas maliciosas ou inválidas", () => {
    expect(() => parseInput("alert(1)")).toThrow(ConversionError);
    expect(() => parseInput("2 +")).toThrow(ConversionError);
    expect(() => parseInput("1/0")).toThrow(ConversionError);
  });
});

describe("convert — conversões básicas", () => {
  it("1000 g → 1 kg", () => expect(convert(1000, "g", "kg")).toBeCloseTo(1, 12));
  it("1 m → 100 cm", () => expect(convert(1, "m", "cm")).toBeCloseTo(100, 12));
  it("1 in → 25.4 mm", () => expect(convert(1, "in", "mm")).toBeCloseTo(25.4, 10));
  it("1 psi → 6894.757 Pa", () => expect(convert(1, "psi", "Pa")).toBeCloseTo(6894.757293, 4));
  it("1 BTU/h → 0.29307107 W", () =>
    expect(convert(1, "BTU_h", "W")).toBeCloseTo(0.29307107, 8));
  it("1 kWh → 3.6e6 J", () => expect(convert(1, "kWh", "J")).toBeCloseTo(3.6e6, 6));
  it("1 kgf → 9.80665 N", () => expect(convert(1, "kgf", "N")).toBeCloseTo(9.80665, 10));
  it("1 MPa → 1e6 Pa", () => expect(convert(1, "MPa", "Pa")).toBeCloseTo(1e6, 6));
  it("1 kN·m → 101.9716 kgf·m", () =>
    expect(convert(1, "kNm", "kgfm")).toBeCloseTo(101.9716213, 5));
  it("1 lb/ft³ → 16.0184 kg/m³", () =>
    expect(convert(1, "lb_ft3", "kg_m3")).toBeCloseTo(16.018463, 5));
});

describe("convert — temperatura", () => {
  it("0 °C → 32 °F", () => expect(convert(0, "C", "F")).toBeCloseTo(32, 10));
  it("100 °C → 212 °F", () => expect(convert(100, "C", "F")).toBeCloseTo(212, 10));
  it("0 °C → 273.15 K", () => expect(convert(0, "C", "K")).toBeCloseTo(273.15, 10));
  it("-40 °C → -40 °F", () => expect(convert(-40, "C", "F")).toBeCloseTo(-40, 10));
});

describe("convert — ângulos e inclinação", () => {
  it("45° → 100% de inclinação", () => expect(convert(45, "deg", "pct")).toBeCloseTo(100, 8));
  it("100% → 45°", () => expect(convert(100, "pct", "deg")).toBeCloseTo(45, 8));
  it("π rad → 180°", () => expect(convert(Math.PI, "rad", "deg")).toBeCloseTo(180, 10));
});

describe("convert — erros", () => {
  it("rejeita grandezas incompatíveis", () => {
    expect(() => convert(1, "m", "kg")).toThrow(ConversionError);
  });
  it("rejeita unidade desconhecida", () => {
    expect(() => convert(1, "foo", "kg")).toThrow(ConversionError);
  });
});

describe("combine — conversões compostas", () => {
  it("2 m³ × 7850 kg/m³ → 15700 kg", () => {
    expect(
      combine({ value: 2, unitId: "m3" }, { value: 7850, unitId: "kg_m3" }, "multiply"),
    ).toBeCloseTo(15700, 8);
  });
  it("1000 kg ÷ 2 m³ → 500 kg/m³", () => {
    expect(
      combine({ value: 1000, unitId: "kg" }, { value: 2, unitId: "m3" }, "divide"),
    ).toBeCloseTo(500, 8);
  });
});

describe("formatOutput", () => {
  it("usa vírgula decimal em pt-BR", () => {
    expect(formatOutput(1.2345, { decimals: 3 })).toBe("1,235");
  });
  it("usa notação científica para valores extremos", () => {
    expect(formatOutput(1e9, { decimals: 3 })).toContain("e+");
    expect(formatOutput(1e-6, { decimals: 3 })).toContain("e-");
  });
  it("respeita locale en-US no export", () => {
    expect(formatOutput(1.5, { decimals: 2, locale: "en-US" })).toBe("1.5");
  });
});

describe("historyToCSV", () => {
  it("gera cabeçalho e linha válidos", () => {
    const csv = historyToCSV([
      {
        id: "1",
        timestamp: 0,
        category: "massa",
        input: "1000",
        valueFrom: 1000,
        fromUnit: "g",
        toUnit: "kg",
        result: 1,
      },
    ]);
    const [header, row] = csv.split("\n");
    expect(header.split(";")).toHaveLength(7);
    expect(row.split(";")).toHaveLength(7);
  });
});
