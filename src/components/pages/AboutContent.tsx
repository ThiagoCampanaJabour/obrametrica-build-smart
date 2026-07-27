export const meta = {
  title: "Sobre — Obra Métrica",
  description:
    "Obra Métrica oferece calculadoras gratuitas para estimar materiais, custos e otimizar compras na construção civil.",
};

export function AboutContent() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Sobre o Obra Métrica
      </h1>

      <p className="lead text-muted-foreground">
        O Obra Métrica é uma plataforma brasileira de calculadoras técnicas gratuitas para
        construção civil, energia solar e conversões de unidades. Nasceu para resolver um problema
        simples, mas comum: estimar materiais, custos e quantidades de obra sem depender de
        planilhas complexas ou cálculos manuais que costumam gerar desperdício e compras erradas.
      </p>

      <p>
        Nossa missão é colocar ferramentas rápidas e confiáveis na mão de quem realmente constrói.
        Mestres de obra, pedreiros, engenheiros, arquitetos e até quem faz a própria reforma em casa
        encontram calculadoras práticas para telhas, blocos, tinta, concreto, argamassa, tubos, aço
        e muito mais. Os resultados podem ser usados para montar listas de compras, comparar
        orçamentos e planejar o cronograma com mais segurança. Tudo é gratuito e acessível sem
        cadastro.
      </p>

      <p>
        Trabalhamos com metodologia baseada em fórmulas técnicas e coeficientes padrão de mercado.
        Sabemos que cada obra é diferente, por isso deixamos os valores editáveis — densidade,
        rendimento, perdas, espessura e outras variáveis podem ser ajustados conforme a realidade do
        seu canteiro. Por isso, nossos resultados são estimativas confiáveis, mas não substituem
        laudos, memoriais de cálculo ou acompanhamento técnico em projetos críticos.
      </p>

      <p>
        Desde 2021, seguimos aprimorando as ferramentas e mantendo o site aberto. Queremos
        simplificar o dia a dia de quem trabalha com obras. Dúvidas, sugestões ou parcerias?{" "}
        <a href="/contato" className="text-primary hover:underline">
          Fale conosco
        </a>
        , leia nossa{" "}
        <a href="/metodologia" className="text-primary hover:underline">
          metodologia
        </a>{" "}
        ou acompanhe a trajetória no{" "}
        <a
          href="https://linkedin.com/company/obrametrica"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          LinkedIn
        </a>
        .
      </p>
    </div>
  );
}
