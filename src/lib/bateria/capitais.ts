// Presets das 26 capitais + Distrito Federal.
// Valores de irradiância (GHI kWh/m²·dia) e consumo médio residencial (kWh/dia)
// aproximados a partir de dados públicos (INMET, ANEEL, EPE — 2023/2024).
// Use como ponto de partida; ajuste com dados locais/faturas reais.

export interface CapitalPreset {
  cidade: string;
  uf: string;
  lat: number;
  lng: number;
  irradianciaKWhM2Dia: number;   // GHI médio diário anual
  consumoMedioKWhDia: number;    // consumo residencial médio (kWh/dia)
}

export const CAPITAIS_BR: CapitalPreset[] = [
  { cidade: "Rio Branco",     uf: "AC", lat: -9.97,  lng: -67.81, irradianciaKWhM2Dia: 4.6, consumoMedioKWhDia: 5.5 },
  { cidade: "Maceió",         uf: "AL", lat: -9.65,  lng: -35.73, irradianciaKWhM2Dia: 5.6, consumoMedioKWhDia: 4.5 },
  { cidade: "Macapá",         uf: "AP", lat:  0.03,  lng: -51.07, irradianciaKWhM2Dia: 5.0, consumoMedioKWhDia: 6.5 },
  { cidade: "Manaus",         uf: "AM", lat: -3.10,  lng: -60.02, irradianciaKWhM2Dia: 4.7, consumoMedioKWhDia: 8.0 },
  { cidade: "Salvador",       uf: "BA", lat: -12.97, lng: -38.51, irradianciaKWhM2Dia: 5.6, consumoMedioKWhDia: 4.8 },
  { cidade: "Fortaleza",      uf: "CE", lat: -3.72,  lng: -38.54, irradianciaKWhM2Dia: 6.0, consumoMedioKWhDia: 5.0 },
  { cidade: "Brasília",       uf: "DF", lat: -15.79, lng: -47.88, irradianciaKWhM2Dia: 5.4, consumoMedioKWhDia: 5.5 },
  { cidade: "Vitória",        uf: "ES", lat: -20.32, lng: -40.34, irradianciaKWhM2Dia: 5.1, consumoMedioKWhDia: 5.2 },
  { cidade: "Goiânia",        uf: "GO", lat: -16.69, lng: -49.26, irradianciaKWhM2Dia: 5.5, consumoMedioKWhDia: 5.5 },
  { cidade: "São Luís",       uf: "MA", lat: -2.53,  lng: -44.30, irradianciaKWhM2Dia: 5.3, consumoMedioKWhDia: 5.8 },
  { cidade: "Cuiabá",         uf: "MT", lat: -15.60, lng: -56.10, irradianciaKWhM2Dia: 5.4, consumoMedioKWhDia: 7.5 },
  { cidade: "Campo Grande",   uf: "MS", lat: -20.45, lng: -54.62, irradianciaKWhM2Dia: 5.3, consumoMedioKWhDia: 6.0 },
  { cidade: "Belo Horizonte", uf: "MG", lat: -19.92, lng: -43.94, irradianciaKWhM2Dia: 5.2, consumoMedioKWhDia: 5.0 },
  { cidade: "Belém",          uf: "PA", lat: -1.46,  lng: -48.50, irradianciaKWhM2Dia: 4.9, consumoMedioKWhDia: 6.0 },
  { cidade: "João Pessoa",    uf: "PB", lat: -7.12,  lng: -34.86, irradianciaKWhM2Dia: 5.7, consumoMedioKWhDia: 4.7 },
  { cidade: "Curitiba",       uf: "PR", lat: -25.42, lng: -49.27, irradianciaKWhM2Dia: 4.3, consumoMedioKWhDia: 5.0 },
  { cidade: "Recife",         uf: "PE", lat: -8.05,  lng: -34.90, irradianciaKWhM2Dia: 5.7, consumoMedioKWhDia: 4.8 },
  { cidade: "Teresina",       uf: "PI", lat: -5.09,  lng: -42.80, irradianciaKWhM2Dia: 5.8, consumoMedioKWhDia: 6.0 },
  { cidade: "Rio de Janeiro", uf: "RJ", lat: -22.91, lng: -43.17, irradianciaKWhM2Dia: 4.9, consumoMedioKWhDia: 5.5 },
  { cidade: "Natal",          uf: "RN", lat: -5.79,  lng: -35.21, irradianciaKWhM2Dia: 5.8, consumoMedioKWhDia: 5.0 },
  { cidade: "Porto Alegre",   uf: "RS", lat: -30.03, lng: -51.23, irradianciaKWhM2Dia: 4.4, consumoMedioKWhDia: 5.5 },
  { cidade: "Porto Velho",    uf: "RO", lat: -8.76,  lng: -63.90, irradianciaKWhM2Dia: 4.8, consumoMedioKWhDia: 6.5 },
  { cidade: "Boa Vista",      uf: "RR", lat:  2.82,  lng: -60.67, irradianciaKWhM2Dia: 5.2, consumoMedioKWhDia: 7.0 },
  { cidade: "Florianópolis",  uf: "SC", lat: -27.60, lng: -48.55, irradianciaKWhM2Dia: 4.5, consumoMedioKWhDia: 5.2 },
  { cidade: "São Paulo",      uf: "SP", lat: -23.55, lng: -46.63, irradianciaKWhM2Dia: 4.5, consumoMedioKWhDia: 5.5 },
  { cidade: "Aracaju",        uf: "SE", lat: -10.91, lng: -37.07, irradianciaKWhM2Dia: 5.5, consumoMedioKWhDia: 4.5 },
  { cidade: "Palmas",         uf: "TO", lat: -10.25, lng: -48.32, irradianciaKWhM2Dia: 5.5, consumoMedioKWhDia: 6.0 },
];

export const CAPITAIS_BR_SORTED: CapitalPreset[] = [...CAPITAIS_BR].sort((a, b) =>
  a.cidade.localeCompare(b.cidade, "pt-BR"),
);
