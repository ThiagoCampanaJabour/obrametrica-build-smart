import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { ConverterForm } from "@/components/Conversor/ConverterForm";
import { ComposedPanel } from "@/components/Conversor/ComposedPanel";
import { HistoryPanel } from "@/components/Conversor/HistoryPanel";
import { CalculatorShell } from "@/components/calc-ui";
import { HISTORY_VERSION, type HistoryEntry } from "@/lib/conversor/calc";
import type { CategoryId } from "@/lib/conversor/units";

const PATH = "/construcao-civil/conversor-unidades-tecnicas";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Conversor de Unidades Técnicas", path: PATH },
];

const HISTORY_KEY = "obrametrica:conversor:history:v1";
const FAVORITES_KEY = "obrametrica:conversor:favorites:v1";
const SETTINGS_KEY = "obrametrica:conversor:settings:v1";

const DEFAULT_FAVORITES = ["m", "cm", "mm", "m2", "m3", "L", "kg", "t", "kg_m3", "kN", "MPa", "kWh", "kW", "C", "L_s", "kNm", "deg"];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Como as conversões são calculadas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Todo valor é primeiro convertido para a unidade base do Sistema Internacional da categoria (metro, quilograma, pascal, joule etc.) e depois para a unidade de destino. Os fatores seguem o SI (BIPM), o NIST SP 811 e a ISO 80000.",
      },
    },
    {
      "@type": "Question",
      name: "O conversor aceita expressões e notação científica?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. É possível digitar 1.2e3, 2,5 (vírgula decimal) ou expressões simples como 3 * (2 + 1). O parser aceita apenas números, parênteses e os operadores + - * / ^, sem qualquer execução de código.",
      },
    },
    {
      "@type": "Question",
      name: "Meu histórico de conversões fica salvo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim, no próprio navegador (localStorage). Nada é enviado a servidores. Você pode favoritar unidades, exportar o histórico em CSV ou JSON e limpá-lo quando quiser.",
      },
    },
    {
      "@type": "Question",
      name: "Dá para converter grandezas compostas, como volume em massa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. No painel de conversão composta você multiplica ou divide duas grandezas já normalizadas ao SI — por exemplo, 2 m³ × 7850 kg/m³ = 15 700 kg de aço.",
      },
    },
  ],
};

export const Route = createFileRoute("/construcao-civil/conversor-unidades-tecnicas")({
  head: () =>
    pageHead({
      title: "Conversor de Unidades Técnicas — Obra e Projeto | ObraMétrica",
      description:
        "Converta área, volume, massa, densidade, tensão, potência, vazão, torque e temperatura. Histórico local, favoritos, expressões e export CSV/JSON.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Conversor de Unidades Técnicas",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: ConversorPage,
});

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function ConversorPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<string[]>(DEFAULT_FAVORITES);
  const [maxHistory, setMaxHistory] = useState(20);
  const [decimals, setDecimals] = useState(3);
  const [scientific, setScientific] = useState(false);
  const [restore, setRestore] = useState<
    { category: CategoryId; from: string; to: string; input: string } | null
  >(null);

  // Carrega estado persistido apenas no cliente (evita hydration mismatch).
  useEffect(() => {
    const stored = readJSON<{ version: number; entries: HistoryEntry[] }>(HISTORY_KEY, {
      version: HISTORY_VERSION,
      entries: [],
    });
    if (stored.version === HISTORY_VERSION) setHistory(stored.entries);
    setFavorites(readJSON<string[]>(FAVORITES_KEY, DEFAULT_FAVORITES));
    const settings = readJSON(SETTINGS_KEY, { decimals: 3, scientific: false, maxHistory: 20 });
    setDecimals(settings.decimals);
    setScientific(settings.scientific);
    setMaxHistory(settings.maxHistory);
  }, []);

  const persistHistory = useCallback((entries: HistoryEntry[]) => {
    setHistory(entries);
    window.localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify({ version: HISTORY_VERSION, entries }),
    );
  }, []);

  const handleResult = useCallback(
    (entry: Omit<HistoryEntry, "id" | "timestamp">) => {
      setHistory((prev) => {
        const first = prev[0];
        if (
          first &&
          first.fromUnit === entry.fromUnit &&
          first.toUnit === entry.toUnit &&
          first.valueFrom === entry.valueFrom
        ) {
          return prev;
        }
        const next = [
          { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, timestamp: Date.now() },
          ...prev,
        ].slice(0, maxHistory);
        window.localStorage.setItem(
          HISTORY_KEY,
          JSON.stringify({ version: HISTORY_VERSION, entries: next }),
        );
        return next;
      });
    },
    [maxHistory],
  );

  function toggleFavorite(unitId: string) {
    setFavorites((prev) => {
      const next = prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId];
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }

  function saveSettings(next: { decimals?: number; scientific?: boolean; maxHistory?: number }) {
    const merged = { decimals, scientific, maxHistory, ...next };
    setDecimals(merged.decimals);
    setScientific(merged.scientific);
    setMaxHistory(merged.maxHistory);
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  }

  return (
    <CalculatorShell
      title="Conversor de Unidades Técnicas"
      description="Conversões rápidas entre as unidades usadas em obra e projeto."
      breadcrumbs={CRUMBS}
      extrasId="conversor"
    >
      <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Como usar</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Escolha a categoria e as unidades de origem e destino.</li>
          <li>Digite o valor — aceita notação científica e expressões.</li>
          <li>Use “Inverter” para trocar as unidades e “Copiar” para o resultado.</li>
        </ul>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <ConverterForm
            decimals={decimals}
            scientific={scientific}
            favorites={favorites}
            onResult={handleResult}
            restore={restore}
          />
          <ComposedPanel decimals={decimals} />

          <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Configurações</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="precisao" className="block text-sm font-medium text-foreground">
                  Precisão
                </label>
                <select
                  id="precisao"
                  value={decimals}
                  onChange={(event) => saveSettings({ decimals: Number(event.target.value) })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value={3}>Rápido (3 casas)</option>
                  <option value={8}>Preciso (8 casas)</option>
                </select>
              </div>
              <div>
                <label htmlFor="historico" className="block text-sm font-medium text-foreground">
                  Tamanho do histórico
                </label>
                <input
                  id="historico"
                  type="number"
                  min={10}
                  max={100}
                  step={10}
                  value={maxHistory}
                  onChange={(event) =>
                    saveSettings({
                      maxHistory: Math.min(100, Math.max(10, Number(event.target.value) || 20)),
                    })
                  }
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={scientific}
                    onChange={(event) => saveSettings({ scientific: event.target.checked })}
                    className="h-4 w-4 rounded border-input"
                  />
                  Forçar notação científica
                </label>
              </div>
            </div>
          </div>
        </div>

        <HistoryPanel
          entries={history}
          favorites={favorites}
          decimals={decimals}
          onReuse={(entry) =>
            setRestore({
              category: entry.category as CategoryId,
              from: entry.fromUnit,
              to: entry.toUnit,
              input: entry.input,
            })
          }
          onToggleFavorite={toggleFavorite}
          onDelete={(id) => persistHistory(history.filter((item) => item.id !== id))}
          onClear={() => persistHistory([])}
        />
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Fatores de conversão baseados no SI (BIPM), NIST SP 811 e ISO 80000. Todos os cálculos são
        feitos no seu dispositivo.
      </p>
    </CalculatorShell>
  );
}
