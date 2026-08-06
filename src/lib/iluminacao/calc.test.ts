import { describe, expect, it } from "vitest";
import {
  calcAmbiente,
  calcDaylightFactor,
  calcIluminacao,
  irradianciaFachada,
  reducaoProtecoes,
  toCSVIluminacao,
  validarAmbiente,
  getCidade,
  PROTECOES_PADRAO,
  type AmbienteInput,
} from "./calc";

const base: AmbienteInput = {
  id: "amb-1",
  nome: "Sala Leste",
  orientacao: "L",
  cidadeId: "sao-paulo",
  mes: 3,
  larguraJanelaM: 2,
  alturaJanelaM: 1.5,
  areaAmbienteM2: 20,
  profundidadeM: 4,
  peDireitoM: 2.7,
  vidro: "simples",
  obstrucao: "nenhuma",
  albedo: "medio",
  uso: "escritorio",
  targetLux: 400,
  protecoes: { ...PROTECOES_PADRAO },
  faixas: [{ inicio: 8, fim: 12 }],
};

describe("calcDaylightFactor", () => {
  it("gera DF em ordem de grandeza plausível (0,5%–10%)", () => {
    const { dfPct, areaVidroM2, tvEfetivo } = calcDaylightFactor(base);
    expect(areaVidroM2).toBeCloseTo(3, 3);
    expect(tvEfetivo).toBeCloseTo(0.8, 3);
    expect(dfPct).toBeGreaterThan(0.5);
    expect(dfPct).toBeLessThan(10);
  });

  it("reduz o DF ao trocar por vidro refletivo", () => {
    const simples = calcDaylightFactor(base).dfPct;
    const refletivo = calcDaylightFactor({ ...base, vidro: "refletivo" }).dfPct;
    expect(refletivo).toBeLessThan(simples);
    expect(refletivo / simples).toBeCloseTo(0.3 / 0.8, 2);
  });

  it("reduz o DF com película forte", () => {
    const comFilme = calcDaylightFactor({
      ...base,
      protecoes: { ...PROTECOES_PADRAO, pelicula: "forte" },
    }).dfPct;
    expect(comFilme).toBeLessThan(calcDaylightFactor(base).dfPct);
  });
});

describe("irradianciaFachada", () => {
  it("é nula fora do período diurno", () => {
    expect(irradianciaFachada(5, "L", getCidade("sao-paulo"), 3).total).toBe(0);
    expect(irradianciaFachada(19, "O", getCidade("sao-paulo"), 3).total).toBe(0);
  });

  it("privilegia fachada Leste pela manhã e Oeste à tarde", () => {
    const cid = getCidade("sao-paulo");
    expect(irradianciaFachada(8, "L", cid, 3).direta).toBeGreaterThan(
      irradianciaFachada(8, "O", cid, 3).direta,
    );
    expect(irradianciaFachada(16, "O", cid, 3).direta).toBeGreaterThan(
      irradianciaFachada(16, "L", cid, 3).direta,
    );
  });
});

describe("reducaoProtecoes", () => {
  it("beiral é eficaz com sol alto e pouco eficaz com sol rasante", () => {
    const p = { ...PROTECOES_PADRAO, beiralM: 1 };
    expect(reducaoProtecoes(p, 1.5, 70, 0)).toBeGreaterThan(reducaoProtecoes(p, 1.5, 15, 0));
  });

  it("sem proteção não há redução", () => {
    expect(reducaoProtecoes(PROTECOES_PADRAO, 1.5, 60, 0)).toBe(0);
  });
});

describe("calcAmbiente", () => {
  it("caso A — fachada Leste em SP produz iluminância plausível", () => {
    const r = calcAmbiente(base);
    expect(r.faixas).toHaveLength(1);
    expect(r.faixas[0]!.eMediaLux).toBeGreaterThan(100);
    expect(r.faixas[0]!.eMediaLux).toBeLessThan(60000);
    expect(r.eInsideDFLux).toBeGreaterThan(0);
    expect(r.recomendacoes.length).toBeGreaterThan(0);
  });

  it("caso B — beiral reduz a iluminância na fachada Oeste à tarde", () => {
    const oeste: AmbienteInput = {
      ...base,
      id: "amb-2",
      nome: "Escritório Oeste",
      orientacao: "O",
      cidadeId: "rio-de-janeiro",
      larguraJanelaM: 3,
      areaAmbienteM2: 35,
      faixas: [{ inicio: 12, fim: 16 }],
    };
    const sem = calcAmbiente(oeste).faixas[0]!.eMediaLux;
    const com = calcAmbiente({
      ...oeste,
      protecoes: { ...PROTECOES_PADRAO, beiralM: 1 },
    }).faixas[0]!.eMediaLux;
    expect(com).toBeLessThan(sem);
  });
});

describe("validação e exportação", () => {
  it("rejeita área de vidro maior que o ambiente", () => {
    expect(validarAmbiente({ ...base, areaAmbienteM2: 2 })).toMatch(/área de vidro/);
  });

  it("aceita o caso base", () => {
    expect(validarAmbiente(base)).toBeNull();
  });

  it("CSV contém cabeçalho e uma linha por faixa", () => {
    const csv = toCSVIluminacao(calcIluminacao([base]));
    const linhas = csv.split("\n");
    expect(linhas[0]).toContain("e_inside_lux_medio");
    expect(linhas).toHaveLength(2);
  });
});
