/**
 * Registro central de conteúdo enriquecido das calculadoras.
 *
 * Cada calculadora define: introdução, como funciona, fórmula, exemplo
 * prático, dicas, erros comuns, tabela de referência (opcional), FAQ e
 * calculadoras relacionadas. Este conteúdo é renderizado pelo
 * componente `CalcExtras` abaixo da ferramenta e também alimenta o
 * schema.org `FAQPage` no <head> da página.
 *
 * Ao adicionar uma nova calculadora, basta registrar aqui o objeto
 * completo — nenhum código adicional é necessário no shell.
 */

export interface CalcFaq {
  q: string;
  a: string;
}

export interface CalcTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface CalcExample {
  scenario: string;
  steps: string[];
  result: string;
}

export interface CalcRelated {
  path: string;
  label: string;
}

export interface CalculatorContent {
  path: string;
  name: string;
  intro: string;
  /** Parágrafos extras de contexto, exibidos abaixo da introdução. */
  context?: string[];
  /** Situações típicas em que a calculadora é útil. */
  whenToUse?: string[];
  howItWorks: string[];
  formula: {
    expression: string;
    legend?: string[];
  };
  example: CalcExample;
  /** Cenários adicionais para reforçar o entendimento. */
  moreExamples?: CalcExample[];
  tips: string[];
  errors: string[];
  table?: CalcTable;
  faq: CalcFaq[];
  related: CalcRelated[];
}

const REL_TIJOLOS: CalcRelated = { path: "/calculadora-de-tijolos", label: "Calculadora de Tijolos" };
const REL_CONCRETO: CalcRelated = { path: "/calculadora-de-concreto", label: "Calculadora de Concreto" };
const REL_PISO: CalcRelated = { path: "/calculadora-de-piso", label: "Calculadora de Piso" };
const REL_TINTA: CalcRelated = { path: "/calculadora-de-tinta", label: "Calculadora de Tinta" };
const REL_ARGAMASSA: CalcRelated = { path: "/calculadora-de-argamassa", label: "Calculadora de Argamassa" };
const REL_PLACAS: CalcRelated = { path: "/quantas-placas-solares-preciso", label: "Quantas placas solares preciso?" };
const REL_ECONOMIA: CalcRelated = { path: "/economia-energia-solar", label: "Economia com Energia Solar" };
const REL_M2_HA: CalcRelated = { path: "/conversor-m2-para-hectare", label: "Conversor m² para hectare" };
const REL_CM_IN: CalcRelated = { path: "/conversor-cm-para-polegada", label: "Conversor cm para polegada" };
const REL_L_M3: CalcRelated = { path: "/conversor-litros-para-m3", label: "Conversor litros para m³" };

export const CALCULATORS: Record<string, CalculatorContent> = {
  "/calculadora-de-tijolos": {
    path: "/calculadora-de-tijolos",
    name: "Calculadora de Tijolos",
    intro:
      "Calcule quantos tijolos são necessários para levantar uma parede a partir da sua área e do tipo de bloco escolhido. A ferramenta já considera 10% de perdas com quebras e cortes, valor usual em obras residenciais.",
    context: [
      "O cálculo de tijolos é uma das primeiras etapas do orçamento de uma obra de alvenaria. Errar a quantidade impacta diretamente o cronograma: pedir a menos obriga a interromper o serviço para uma nova compra, e pedir a mais imobiliza capital e ocupa espaço no canteiro.",
      "Além do tipo de tijolo, o rendimento por metro quadrado varia com a espessura da junta de argamassa e a qualidade do assentamento. Por isso, a calculadora adota o consumo médio de mercado e acrescenta 10% de perda — uma margem confortável para obras residenciais convencionais.",
    ],
    whenToUse: [
      "Levantar paredes de vedação em obras residenciais.",
      "Orçar reformas com ampliação de cômodos ou muros.",
      "Comparar rapidamente o custo entre tipos diferentes de tijolo.",
    ],
    howItWorks: [
      "Informe o comprimento e a altura da parede em metros.",
      "Escolha o tipo de tijolo cerâmico. Cada tipo tem um consumo médio conhecido por metro quadrado.",
      "A calculadora multiplica a área pela quantidade de tijolos por m² e acrescenta 10% de perda.",
    ],
    formula: {
      expression: "Quantidade = (Comprimento × Altura) × Consumo por m² × 1,10",
    },
    example: {
      scenario: "Parede de 5 m de comprimento por 2,8 m de altura, com tijolo 9×19×19 cm.",
      steps: [
        "Área = 5 × 2,8 = 14 m²",
        "Consumo do tijolo 9×19×19 ≈ 25 tijolos/m²",
        "Quantidade bruta = 14 × 25 = 350 tijolos",
        "Com 10% de perda = 350 × 1,10 = 385 tijolos",
      ],
      result: "Serão necessários aproximadamente 385 tijolos.",
    },
    moreExamples: [
      {
        scenario: "Muro externo de 20 m de comprimento por 2 m de altura com bloco cerâmico 11×14×24 cm.",
        steps: [
          "Área = 20 × 2 = 40 m²",
          "Consumo do bloco ≈ 22 un/m²",
          "Quantidade bruta = 40 × 22 = 880 tijolos",
          "Com 10% de perda = 880 × 1,10 = 968 tijolos",
        ],
        result: "Compre 968 tijolos para o muro.",
      },
    ],
    tips: [
      "Desconte áreas de portas e janelas do total antes de calcular.",
      "Compre sempre a quantidade com folga: sobra de 5% a 10% evita interromper a obra.",
      "Confirme o consumo por m² com o fornecedor do tijolo, pois pode variar conforme o fabricante.",
    ],
    errors: [
      "Esquecer de descontar vãos de portas e janelas gera compra em excesso.",
      "Usar altura em cm em vez de metros multiplica o resultado por 100.",
      "Confundir tijolo de vedação com bloco estrutural — os consumos por m² são diferentes.",
    ],
    table: {
      caption: "Consumo médio de tijolos por m² de parede",
      headers: ["Tipo de tijolo", "Dimensões (cm)", "Consumo por m²"],
      rows: [
        ["Tijolo cerâmico 8 furos", "9 × 19 × 19", "25 un"],
        ["Bloco cerâmico", "11 × 14 × 24", "22 un"],
        ["Bloco cerâmico grande", "14 × 19 × 29", "16 un"],
      ],
    },
    faq: [
      {
        q: "Como calcular a quantidade de tijolos por m²?",
        a: "Basta multiplicar a área da parede pelo consumo médio do tijolo escolhido e acrescentar uma margem de 10% para perdas. A calculadora do Obra Métrica faz esse cálculo automaticamente.",
      },
      {
        q: "Preciso descontar portas e janelas?",
        a: "Sim. Some as áreas de todos os vãos (portas e janelas) e subtraia da área total da parede antes de calcular. Isso evita comprar tijolos em excesso.",
      },
      {
        q: "Qual a margem de perda ideal para tijolos?",
        a: "A margem padrão em obras residenciais é de 10%. Em obras com muitos recortes, curvas ou paredes pequenas, pode chegar a 15%.",
      },
      {
        q: "A calculadora serve para blocos de concreto?",
        a: "A calculadora atual é otimizada para tijolos cerâmicos. Para blocos de concreto, o consumo por m² é diferente (geralmente 12,5 blocos/m² para o modelo 14×19×39).",
      },
    ],
    related: [REL_CIMENTO, REL_ARGAMASSA, REL_TIJOLOS, REL_PISO],
  },

  "/calculadora-de-cimento": {
    path: "/calculadora-de-cimento",
    name: "Calculadora de Cimento",
    intro:
      "Calcule a quantidade de cimento necessária para produzir concreto com a resistência desejada. Esta calculadora usa dosagens técnicas baseadas na NBR 12655 e é essencial para orçamentos e planejamento de obras.",
    context: [
      "O cimento é o aglomerante principal do concreto. Sua quantidade define a resistência final da peça — quanto mais cimento, mais resistente o concreto. Errar na dosagem compromete a durabilidade e a segurança estrutural.",
      "As dosagens seguem normas técnicas rigorosas (NBR 12655). Usar menos cimento para economizar é uma falsa economia que pode resultar em fissuras, infiltrações e até colapso estrutural. A calculadora adota valores conservadores baseados em recomendações de engenheiros e fabricantes.",
    ],
    whenToUse: [
      "Orçar a quantidade de cimento para uma obra.",
      "Calcular dosagem de concreto usinado ou virado na obra.",
      "Validar propostas comerciais de fornecedores.",
    ],
    howItWorks: [
      "Informe o volume total de concreto em metros cúbicos (m³).",
      "Escolha a resistência desejada (fck) — quanto maior, mais cimento é necessário.",
      "A calculadora multiplica o volume pela dosagem técnica e converte em sacos de 50 kg.",
    ],
    formula: {
      expression: "Cimento (kg) = Volume (m³) × Dosagem por m³ (kg/m³)",
      legend: [
        "fck 20 MPa = 340 kg/m³",
        "fck 25 MPa = 360 kg/m³",
        "fck 30 MPa = 380 kg/m³",
        "fck 35 MPa = 400 kg/m³",
        "Valores baseados em NBR 12655 para concreto com abatimento 100–120 mm.",
      ],
    },
    example: {
      scenario: "Produzir 5 m³ de concreto com fck 25 MPa.",
      steps: [
        "Dosagem para fck 25 = 360 kg/m³",
        "Cimento total = 5 × 360 = 1.800 kg",
        "Sacos de 50 kg = 1.800 / 50 = 36 sacos",
      ],
      result: "Serão necessários 36 sacos de cimento de 50 kg.",
    },
    moreExamples: [
      {
        scenario: "Fundação com 10 m³ de concreto fck 30 MPa.",
        steps: [
          "Dosagem para fck 30 = 380 kg/m³",
          "Cimento total = 10 × 380 = 3.800 kg",
          "Sacos de 50 kg = 3.800 / 50 = 76 sacos",
        ],
        result: "Compre 76 sacos de cimento para a fundação.",
      },
    ],
    tips: [
      "Sempre compre 10% a mais de cimento para compensar perdas e desperdícios.",
      "Cimento Portland CP II-E é adequado para a maioria das obras residenciais; CP V-ARI é usado para ganho rápido de resistência.",
      "Armazene cimento em local seco e protegido da umidade; tem validade de 3 meses.",
      "A resistência final depende também da qualidade da areia, brita e água utilizadas.",
    ],
    errors: [
      "Usar dosagem insuficiente de cimento resulta em concreto fraco e pouco durável.",
      "Excesso de água reduz a resistência, mesmo com cimento adequado.",
      "Não considerar o desperdício no cálculo leva a falta de material durante a concretagem.",
      "Misturar tipos diferentes de cimento na mesma obra pode comprometer a qualidade.",
    ],
    table: {
      caption: "Dosagem de cimento por resistência (NBR 12655)",
      headers: ["Resistência (fck)", "Cimento por m³", "Para 10 m³"],
      rows: [
        ["fck 20 MPa", "340 kg/m³", "3.400 kg (68 sacos)"],
        ["fck 25 MPa", "360 kg/m³", "3.600 kg (72 sacos)"],
        ["fck 30 MPa", "380 kg/m³", "3.800 kg (76 sacos)"],
        ["fck 35 MPa", "400 kg/m³", "4.000 kg (80 sacos)"],
      ],
    },
    faq: [
      {
        q: "Qual é a diferença entre fck 20 e fck 30?",
        a: "fck é a resistência à compressão do concreto em MPa. fck 30 é mais resistente que fck 20 e requer mais cimento. Use fck 30 para estruturas críticas, fundações profundas e elementos sob maior carga.",
      },
      {
        q: "Posso usar menos cimento para economizar?",
        a: "Não. Reduzir cimento compromete a resistência e durabilidade do concreto, podendo causar fissuras e infiltrações. Sempre siga a dosagem técnica.",
      },
      {
        q: "O que fazer com cimento que sobrou?",
        a: "Cimento não deve ser reutilizado em outra obra. Armazene em local seco ou doe para instituições. Nunca misture cimento antigo com novo.",
      },
      {
        q: "Qual é o melhor tipo de cimento?",
        a: "CP II-E (cimento Portland composto) é o mais comum e adequado. CP V-ARI é usado quando se precisa de ganho rápido de resistência (pré-moldados). Sempre siga as especificações do projeto.",
      },
      {
        q: "Como armazenar cimento corretamente?",
        a: "Em local seco, protegido da chuva e umidade, sobre paletes de madeira. Evite contato direto com o chão. Cimento tem validade de 3 meses; use os mais antigos primeiro.",
      },
    ],
    related: [REL_CONCRETO, REL_ARGAMASSA, REL_TINTA, REL_PISO],
  },

  "/calculadora-de-concreto": {
    path: "/calculadora-de-concreto",
    name: "Calculadora de Concreto",
    intro:
      "Calcule o volume de concreto necessário para vigas, pilares, lajes, sapatas ou contrapisos. A ferramenta retorna o volume em metros cúbicos (m³), unidade padrão para pedidos em usinas dosadoras.",
    context: [
      "O concreto é o material mais utilizado na construção civil e também o que mais gera perdas quando o volume é mal estimado. Uma sapata de fundação, por exemplo, precisa ser concretada em uma única etapa — se o caminhão-betoneira chegar com menos que o necessário, é preciso emendar em outro dia, comprometendo a resistência da peça.",
      "Para peças com forma irregular (blocos escalonados, vigas invertidas, escadas), calcule cada trecho separadamente e some os volumes ao final. A calculadora funciona muito bem para elementos retangulares, que representam a maioria das aplicações residenciais.",
    ],
    whenToUse: [
      "Estimar volume para pedir concreto usinado.",
      "Calcular fundações, pilares, vigas e lajes.",
      "Orçar contrapisos e calçadas.",
    ],
    howItWorks: [
      "Informe o comprimento, a largura e a espessura da peça em metros.",
      "A calculadora multiplica as três dimensões para obter o volume total.",
      "Acrescente uma folga de 5% a 10% para compensar perdas no lançamento.",
    ],
    formula: {
      expression: "Volume (m³) = Comprimento × Largura × Espessura",
    },
    example: {
      scenario: "Laje de 6 m × 4 m com 10 cm de espessura.",
      steps: [
        "Converta a espessura para metros: 10 cm = 0,10 m",
        "Volume = 6 × 4 × 0,10 = 2,4 m³",
        "Com 5% de perda ≈ 2,52 m³",
      ],
      result: "Peça aproximadamente 2,5 m³ de concreto.",
    },
    moreExamples: [
      {
        scenario: "10 pilares de 20 × 20 cm com 3 m de altura cada.",
        steps: [
          "Volume por pilar = 0,20 × 0,20 × 3 = 0,12 m³",
          "Total = 10 × 0,12 = 1,2 m³",
          "Com 5% de perda ≈ 1,26 m³",
        ],
        result: "Encomende 1,3 m³ de concreto para os pilares.",
      },
    ],
    tips: [
      "Use sempre metros em todas as dimensões. Uma espessura em cm distorce o resultado em 100 vezes.",
      "Para peças grandes, prefira concreto usinado — a mistura é mais uniforme e reduz perdas.",
      "Verifique com o engenheiro o fck (resistência) recomendado para cada elemento estrutural.",
    ],
    errors: [
      "Misturar unidades (metro e centímetro) na mesma equação.",
      "Esquecer de somar perdas ao volume final.",
      "Calcular peças de geometria complexa como se fossem retangulares, gerando falta de material.",
    ],
    table: {
      caption: "Volume aproximado por tipo de peça",
      headers: ["Peça", "Dimensões típicas", "Volume por metro linear"],
      rows: [
        ["Viga baldrame", "20 × 40 cm", "0,08 m³/m"],
        ["Pilar residencial", "20 × 20 cm", "0,04 m³/m"],
        ["Contrapiso", "5 cm", "0,05 m³/m²"],
        ["Laje maciça", "10 cm", "0,10 m³/m²"],
      ],
    },
    faq: [
      {
        q: "Como calcular quantos m³ de concreto preciso?",
        a: "Multiplique comprimento × largura × espessura em metros. O resultado é o volume em m³. Adicione uma folga de 5% a 10% para perdas.",
      },
      {
        q: "Quantos sacos de cimento tem 1 m³ de concreto?",
        a: "Um traço 1:2:3 comum utiliza cerca de 7 sacos de cimento de 50 kg por m³. Para traços estruturais, o consumo pode chegar a 8 ou 9 sacos.",
      },
      {
        q: "Concreto usinado é mais barato que virado na obra?",
        a: "Para volumes acima de 3 m³, o concreto usinado geralmente compensa: menor perda, mais qualidade e economia de mão de obra.",
      },
      {
        q: "Qual fck usar em cada peça?",
        a: "Consulte o projeto estrutural. Como referência, obras residenciais utilizam fck 25 MPa em pilares e vigas e fck 20 MPa em contrapisos.",
      },
    ],
    related: [REL_ARGAMASSA, REL_TIJOLOS, REL_PISO, REL_L_M3],
  },

  "/calculadora-de-piso": {
    path: "/calculadora-de-piso",
    name: "Calculadora de Piso",
    intro:
      "Descubra quantas caixas de piso ou porcelanato comprar para o seu ambiente. A calculadora considera a área do cômodo, o rendimento da caixa e uma margem de perda para recortes.",
    context: [
      "A escolha do piso é uma das decisões mais visíveis da obra. Comprar poucas caixas obriga a esperar novo lote (com risco de variação de tom), e comprar muitas gera desperdício financeiro. A calculadora resolve essa dúvida antes da visita à loja.",
      "Peças grandes (60×60 cm ou mais) e paginações diagonais geram mais recortes: se for o seu caso, informe uma área ligeiramente maior que a real para que a margem de sobra de 10% cubra os cortes extras com folga.",
    ],
    whenToUse: [
      "Comprar piso cerâmico, porcelanato ou lajota.",
      "Orçar retrofit ou substituição de revestimento.",
      "Comparar rendimento entre modelos com m² diferentes por caixa.",
    ],
    howItWorks: [
      "Meça o comprimento e a largura do cômodo em metros.",
      "Informe quantos m² cada caixa cobre (consulte a embalagem).",
      "A calculadora aplica automaticamente 10% de sobra sobre a área e divide pela cobertura da caixa.",
    ],
    formula: {
      expression: "Caixas = (Comprimento × Largura × 1,10) / m² por caixa",
      legend: [
        "10% é a sobra padrão adotada — cobre recortes usuais em ambientes retangulares.",
        "Para paginação diagonal, espinha de peixe ou peças muito grandes, informe uma área ~5% maior que a real.",
      ],
    },
    example: {
      scenario: "Sala de 5 m × 4 m, piso com 2,5 m² por caixa.",
      steps: [
        "Área = 5 × 4 = 20 m²",
        "Área com 10% de sobra = 20 × 1,10 = 22 m²",
        "Caixas = 22 / 2,5 = 8,8 → arredondar para 9",
      ],
      result: "Compre 9 caixas de piso.",
    },
    moreExamples: [
      {
        scenario: "Sala e cozinha integradas com 32 m², porcelanato de 2,32 m² por caixa.",
        steps: [
          "Área com 10% de sobra = 32 × 1,10 = 35,2 m²",
          "Caixas = 35,2 / 2,32 = 15,17 → 16 caixas",
        ],
        result: "Compre 16 caixas de porcelanato.",
      },
    ],
    tips: [
      "Reserve pelo menos uma caixa extra para reposições futuras — lotes diferentes podem variar de tom.",
      "Para instalação em diagonal ou espinha de peixe, aumente manualmente a área informada em 5%.",
      "Confira o lote da mercadoria; caixas do mesmo lote garantem uniformidade de cor.",
    ],
    errors: [
      "Arredondar caixas para baixo — a calculadora já arredonda para cima automaticamente.",
      "Ignorar recortes complexos em ambientes com muitos ângulos.",
      "Esquecer de somar áreas de nichos e degraus na medição.",
    ],
    table: {
      caption:
        "Margem de perda de referência por tipo de instalação (a calculadora aplica 10%; use os valores abaixo como guia para ajustar sua área)",
      headers: ["Instalação", "Perda sugerida"],
      rows: [
        ["Paginação reta (peças pequenas)", "10%"],
        ["Peças grandes (60×60 cm ou maior)", "12%"],
        ["Diagonal ou espinha de peixe", "15%"],
        ["Ambientes com muitos recortes", "15% a 20%"],
      ],
    },
    faq: [
      {
        q: "Quantos m² de piso comprar a mais?",
        a: "A calculadora já adiciona 10% de sobra. Para paginação diagonal ou peças grandes, informe uma área 5% maior.",
      },
      {
        q: "Como calcular caixas de porcelanato?",
        a: "Divida a área total (já com sobra) pelo rendimento da caixa em m². A calculadora faz esse cálculo automaticamente e arredonda para cima.",
      },
      {
        q: "Vale a pena comprar caixas extras?",
        a: "Sim. Guardar 1 ou 2 caixas do mesmo lote garante que futuras substituições combinem com o piso instalado.",
      },
      {
        q: "Piso e porcelanato usam a mesma calculadora?",
        a: "Sim. O cálculo é o mesmo: área do ambiente × margem de sobra ÷ m² por caixa.",
      },
    ],
    related: [REL_ARGAMASSA, REL_TINTA, REL_TIJOLOS, REL_M2_HA],
  },

  "/calculadora-de-tinta": {
    path: "/calculadora-de-tinta",
    name: "Calculadora de Tinta",
    intro:
      "Calcule quantos litros de tinta você precisa para pintar paredes, tetos ou fachadas. O resultado considera o número de demãos e o rendimento médio informado pelo fabricante.",
    context: [
      "Comprar tinta em quantidade adequada evita duas dores comuns: interromper a pintura para nova compra (com risco de o novo lote apresentar tonalidade ligeiramente diferente) ou terminar com galões cheios que secam antes de serem utilizados em retoques.",
      "Latas de 18 L rendem, em média, 90 m² por demão com tinta látex acrílica premium. Já as latas de 3,6 L são ideais para ambientes pequenos como banheiros e closets. A calculadora considera um rendimento conservador para garantir que o material chegue ao fim do serviço.",
    ],
    whenToUse: [
      "Pintar paredes internas ou externas de residências.",
      "Repintar fachadas ou muros de comércio.",
      "Estimar o custo da mão de obra por m² pintado.",
    ],
    howItWorks: [
      "Meça a área a ser pintada (comprimento × altura da parede).",
      "Escolha o número de demãos — o padrão é 2.",
      "A calculadora adota rendimento médio de 5 m²/L por demão, valor conservador que cobre a maioria das tintas látex do mercado.",
      "Sugerimos comprar +10% para retoques e reposição futura.",
    ],
    formula: {
      expression: "Litros = (Área × Nº de demãos) / 5 m²/L",
      legend: [
        "5 m²/L é um valor conservador que considera perdas por absorção e aplicação.",
        "Tintas premium podem render até 12 m²/L — nesse caso o resultado terá folga extra.",
      ],
    },
    example: {
      scenario: "Sala com 40 m² de paredes, 2 demãos.",
      steps: [
        "Área pintada = 40 × 2 = 80 m²",
        "Litros = 80 / 5 = 16 L",
        "Com folga de 10% ≈ 18 L recomendados",
      ],
      result: "Compre 18 litros de tinta (por exemplo: 1 lata de 18 L).",
    },
    moreExamples: [
      {
        scenario: "Fachada com 120 m² pintada com 2 demãos.",
        steps: [
          "Área pintada = 120 × 2 = 240 m²",
          "Litros = 240 / 5 = 48 L",
          "Com folga ≈ 3 latas de 18 L (54 L)",
        ],
        result: "Compre 3 latas de 18 L da mesma cor e lote.",
      },
    ],
    tips: [
      "Superfícies novas ou muito porosas exigem uma demão de selador antes da tinta.",
      "Cores fortes (vermelho, amarelo, preto) muitas vezes exigem 3 demãos.",
      "Se a tinta da lata anunciar rendimento maior (10–12 m²/L), sobrará material — sem risco de faltar.",
    ],
    errors: [
      "Não descontar portas e janelas superestima o consumo.",
      "Aplicar uma única demão em paredes claras cobrindo tons escuros.",
      "Diluir excessivamente a tinta reduz cobertura e obriga a comprar mais.",
    ],
    table: {
      caption: "Rendimento típico anunciado por tipo de tinta (referência)",
      headers: ["Tipo de tinta", "Rendimento por demão"],
      rows: [
        ["Látex PVA econômica", "8 a 10 m²/L"],
        ["Látex acrílica premium", "10 a 12 m²/L"],
        ["Tinta esmalte", "10 a 14 m²/L"],
        ["Textura acrílica", "2 a 4 m²/kg"],
      ],
    },
    faq: [
      {
        q: "Por que a calculadora usa 5 m²/L?",
        a: "É um valor conservador que garante margem de segurança. Assim, mesmo tintas mais econômicas ou paredes porosas ficam cobertas sem sobrar viagem à loja.",
      },
      {
        q: "Quantas demãos são necessárias?",
        a: "O padrão é 2 demãos. Cores fortes ou paredes escuras podem exigir 3.",
      },
      {
        q: "Preciso descontar portas e janelas?",
        a: "Sim. Some as áreas de portas e janelas e subtraia da área total das paredes antes de calcular.",
      },
      {
        q: "Vai sobrar tinta?",
        a: "Pode sobrar, sim. Isso é intencional: guardar 1–2 litros do mesmo lote garante retoques futuros com a cor exata.",
      },
    ],
    related: [REL_ARGAMASSA, REL_PISO, REL_TIJOLOS, REL_M2_HA],
  },

  "/calculadora-de-argamassa": {
    path: "/calculadora-de-argamassa",
    name: "Calculadora de Argamassa",
    intro:
      "Calcule quantos sacos de argamassa colante são necessários para assentar piso, revestimento ou porcelanato. O resultado considera o consumo médio por m² e o rendimento do saco.",
    context: [
      "A argamassa colante é o elo entre o revestimento e a base. Escolher o tipo errado (ou economizar na quantidade) é a principal causa de descolamento de pisos e azulejos, um dos serviços mais caros de refazer em uma obra.",
      "Peças maiores exigem cordões de argamassa mais altos e, portanto, mais material. Se você trabalha com porcelanato 60×60 cm ou maior, considere acrescentar 15% ao total sugerido pela calculadora.",
    ],
    whenToUse: [
      "Assentar piso cerâmico, porcelanato ou pastilhas.",
      "Revestir áreas molhadas (banheiros, cozinhas, áreas externas).",
      "Estimar quantos sacos comprar em uma reforma.",
    ],
    howItWorks: [
      "Informe a área a ser assentada em metros quadrados.",
      "Escolha o tipo de argamassa (AC-I, AC-II ou AC-III) — cada uma tem consumo específico.",
      "A calculadora multiplica o consumo por m² pela área e converte em sacos de 20 kg.",
    ],
    formula: {
      expression: "Sacos = (Área × Consumo por m²) / 20 kg",
      legend: [
        "Interno (AC-I): 5 kg/m²",
        "Externo (AC-II): 6 kg/m²",
        "Porcelanato (AC-III): 7 kg/m²",
        "A calculadora adota valores conservadores para evitar falta de material.",
      ],
    },
    example: {
      scenario: "Cozinha de 15 m² com porcelanato assentado com argamassa AC-III.",
      steps: [
        "Consumo estimado = 15 × 7 = 105 kg",
        "Sacos de 20 kg = 105 / 20 = 5,25 → arredondar para 6",
      ],
      result: "Compre 6 sacos de argamassa AC-III.",
    },
    moreExamples: [
      {
        scenario: "Área externa de 40 m² com cerâmica assentada em AC-II.",
        steps: [
          "Consumo estimado = 40 × 6 = 240 kg",
          "Sacos de 20 kg = 240 / 20 = 12 sacos",
        ],
        result: "Compre 12 sacos de argamassa AC-II.",
      },
    ],
    tips: [
      "Utilize sempre o tipo correto: AC-III é obrigatório para porcelanato e áreas externas molhadas.",
      "Prepare a quantidade que consegue usar em até 2 horas para evitar desperdício.",
      "Umedeça a superfície antes de aplicar, mas nunca deixe empoçado.",
    ],
    errors: [
      "Usar AC-I em áreas externas ou porcelanatos — a placa pode se descolar.",
      "Preparar muita argamassa de uma vez e perder pelo tempo aberto.",
      "Ignorar o consumo maior em peças grandes (60×60 cm ou mais).",
    ],
    table: {
      caption: "Consumo médio de argamassa adotado pela calculadora",
      headers: ["Tipo", "Aplicação", "Consumo médio"],
      rows: [
        ["AC-I", "Áreas internas secas", "5 kg/m²"],
        ["AC-II", "Áreas externas e molhadas", "6 kg/m²"],
        ["AC-III", "Porcelanato e piscinas", "7 kg/m²"],
      ],
    },
    faq: [
      {
        q: "Quantos sacos de argamassa por m²?",
        a: "Depende do tipo: AC-I consome cerca de 5 kg/m², AC-II 6 kg/m² e AC-III 7 kg/m². Um saco de 20 kg rende entre 2,8 e 4 m² conforme a aplicação.",
      },
      {
        q: "Qual argamassa usar para porcelanato?",
        a: "Sempre AC-III. Ela suporta a baixa absorção do porcelanato e evita descolamentos.",
      },
      {
        q: "Posso usar AC-II em áreas internas?",
        a: "Sim, mas gera custo desnecessário. AC-I atende bem áreas internas secas.",
      },
      {
        q: "Argamassa colante e de assentamento são a mesma coisa?",
        a: "Não. A colante é industrializada, específica para revestimentos. A de assentamento é usada em alvenaria (para colar tijolos).",
      },
    ],
    related: [REL_PISO, REL_TIJOLOS, REL_CONCRETO, REL_TINTA],
  },

  "/quantas-placas-solares-preciso": {
    path: "/quantas-placas-solares-preciso",
    name: "Quantas placas solares preciso?",
    intro:
      "Estime a quantidade de placas fotovoltaicas necessárias para atender o consumo mensal da sua residência ou empresa. O cálculo considera a potência dos módulos e a irradiação solar da região.",
    context: [
      "Dimensionar um sistema fotovoltaico começa por entender o consumo real da residência ou empresa. Um sistema subdimensionado deixa parte da conta a pagar; um sobredimensionado gera crédito de energia que nem sempre é recuperado, pois a distribuidora limita a compensação ao mesmo mês em muitos casos.",
      "A irradiação solar (kWh/m²/dia) varia bastante pelo Brasil. Regiões do Nordeste podem gerar 20% mais energia com a mesma placa instalada no Sul. A calculadora considera essa diferença para retornar um número realista.",
    ],
    whenToUse: [
      "Orçar um sistema fotovoltaico residencial.",
      "Comparar o número de placas necessárias entre regiões.",
      "Validar rapidamente uma proposta comercial.",
    ],
    howItWorks: [
      "Informe o consumo médio mensal em kWh (veja a conta de luz).",
      "Escolha a região para usar a irradiação média local.",
      "A calculadora estima a potência necessária do sistema e divide pela potência das placas.",
    ],
    formula: {
      expression: "Nº de placas = (Consumo mensal / (Irradiação × 30 × Eficiência)) / Potência da placa",
      legend: [
        "Irradiação média Brasil: 4,5 a 6,0 kWh/m²/dia",
        "Eficiência típica do sistema: 75% a 80%",
        "Potência típica das placas atuais: 550 W a 600 W",
      ],
    },
    example: {
      scenario: "Residência com consumo de 400 kWh/mês na região Sudeste (irradiação 5 kWh/m²/dia).",
      steps: [
        "Geração diária necessária = 400 / 30 = 13,3 kWh/dia",
        "Potência do sistema = 13,3 / (5 × 0,80) = 3,3 kWp",
        "Placas de 550 W = 3.300 / 550 = 6 placas",
      ],
      result: "São necessárias aproximadamente 6 placas de 550 W.",
    },
    moreExamples: [
      {
        scenario: "Comércio no Nordeste consumindo 1.200 kWh/mês (irradiação 5,8 kWh/m²/dia).",
        steps: [
          "Geração diária = 1.200 / 30 = 40 kWh/dia",
          "Potência do sistema = 40 / (5,8 × 0,80) = 8,6 kWp",
          "Placas de 550 W = 8.600 / 550 ≈ 16 placas",
        ],
        result: "São necessárias aproximadamente 16 placas de 550 W.",
      },
    ],
    tips: [
      "Analise 12 meses de consumo para captar variações sazonais.",
      "Prefira dimensionar o sistema para 100% do consumo médio anual.",
      "Reserve área de telhado com pelo menos 2 m² por placa.",
    ],
    errors: [
      "Usar apenas o consumo do último mês, que pode não ser representativo.",
      "Ignorar sombreamento parcial — reduz drasticamente a geração.",
      "Superdimensionar o sistema sem levar em conta o limite da distribuidora.",
    ],
    table: {
      caption: "Irradiação solar média por região do Brasil",
      headers: ["Região", "Irradiação (kWh/m²/dia)"],
      rows: [
        ["Norte", "4,5 a 5,0"],
        ["Nordeste", "5,5 a 6,0"],
        ["Centro-Oeste", "5,0 a 5,5"],
        ["Sudeste", "4,8 a 5,3"],
        ["Sul", "4,2 a 4,8"],
      ],
    },
    faq: [
      {
        q: "Como saber quantas placas solares preciso?",
        a: "Divida seu consumo mensal em kWh pela geração média mensal de uma placa na sua região. Um sistema típico gera 30 a 40 kWh por placa por mês.",
      },
      {
        q: "Quantas placas para uma casa que consome 300 kWh/mês?",
        a: "Em regiões com boa irradiação, cerca de 5 a 6 placas de 550 W atendem esse consumo.",
      },
      {
        q: "Qual a potência ideal das placas?",
        a: "As placas mais comuns hoje têm entre 550 W e 600 W. Modelos mais potentes reduzem a área ocupada no telhado.",
      },
      {
        q: "A calculadora considera perdas do sistema?",
        a: "Sim. Aplicamos uma eficiência global de 75% a 80% para representar perdas em inversor, cabeamento e sujeira nas placas.",
      },
    ],
    related: [REL_ECONOMIA, REL_L_M3, REL_M2_HA, REL_CM_IN],
  },

  "/economia-energia-solar": {
    path: "/economia-energia-solar",
    name: "Economia com Energia Solar",
    intro:
      "Simule quanto você pode economizar por mês instalando energia solar. O cálculo compara o valor da sua conta de luz atual com a estimativa de geração do sistema fotovoltaico.",
    context: [
      "A energia solar fotovoltaica se pagou, em média, em 4 a 6 anos no Brasil em 2025. Com o aumento sequencial das tarifas de energia e o desconto oferecido por muitos fornecedores, o retorno tende a se acelerar nos próximos anos.",
      "É importante lembrar que a conta de luz nunca chega a zero: sempre há a taxa mínima (custo de disponibilidade) da concessionária. Ainda assim, sistemas bem dimensionados eliminam mais de 90% do valor mensal.",
    ],
    whenToUse: [
      "Comparar propostas de instaladores fotovoltaicos.",
      "Justificar o investimento para outros decisores.",
      "Projetar a economia acumulada em 5, 10 e 25 anos.",
    ],
    howItWorks: [
      "Informe o valor médio da sua conta de luz em reais.",
      "Informe o percentual do consumo que o sistema atenderá (100% é o mais comum).",
      "A calculadora estima a economia mensal e anual em reais.",
    ],
    formula: {
      expression: "Economia mensal = Valor da conta × Percentual atendido",
    },
    example: {
      scenario: "Conta de luz de R$ 500/mês, sistema dimensionado para atender 95% do consumo.",
      steps: [
        "Economia mensal = 500 × 0,95 = R$ 475",
        "Economia anual = 475 × 12 = R$ 5.700",
      ],
      result: "Economia estimada de R$ 475/mês ou R$ 5.700/ano.",
    },
    moreExamples: [
      {
        scenario: "Comércio com conta de R$ 1.200/mês e sistema para 90% do consumo.",
        steps: [
          "Economia mensal = 1.200 × 0,90 = R$ 1.080",
          "Economia anual = 1.080 × 12 = R$ 12.960",
          "Em 5 anos ≈ R$ 64.800",
        ],
        result: "Economia estimada de R$ 1.080/mês (R$ 64,8 mil em 5 anos).",
      },
    ],
    tips: [
      "Considere a taxa mínima da distribuidora — mesmo com solar você paga o custo de disponibilidade.",
      "O payback médio de um sistema residencial no Brasil está entre 4 e 6 anos.",
      "Reajustes anuais da tarifa aumentam a economia real ao longo do tempo.",
    ],
    errors: [
      "Considerar economia de 100% sem descontar a taxa mínima da concessionária.",
      "Ignorar o Fio B (que passa a ser cobrado gradualmente até 2029).",
      "Não considerar reajustes tarifários que aumentam o benefício futuro.",
    ],
    table: {
      caption: "Economia estimada por faixa de conta de luz",
      headers: ["Conta atual", "Economia mensal (95%)", "Economia anual"],
      rows: [
        ["R$ 300", "R$ 285", "R$ 3.420"],
        ["R$ 500", "R$ 475", "R$ 5.700"],
        ["R$ 800", "R$ 760", "R$ 9.120"],
        ["R$ 1.500", "R$ 1.425", "R$ 17.100"],
      ],
    },
    faq: [
      {
        q: "Quanto se economiza com energia solar por mês?",
        a: "A economia média varia de 85% a 95% do valor da conta, dependendo do dimensionamento do sistema e da tarifa da distribuidora.",
      },
      {
        q: "Qual o payback da energia solar?",
        a: "Entre 4 e 6 anos para residências e 3 a 5 anos para comércios, considerando aumentos anuais da tarifa.",
      },
      {
        q: "A conta de luz zera com energia solar?",
        a: "Não zera totalmente. Sempre haverá a taxa mínima (custo de disponibilidade) da concessionária, que varia de R$ 30 a R$ 100.",
      },
      {
        q: "Vale a pena instalar solar em 2026?",
        a: "Sim. Mesmo com o novo marco legal (Lei 14.300/22), o retorno segue atrativo. Quanto antes, maior o desconto no Fio B.",
      },
    ],
    related: [REL_PLACAS, REL_M2_HA, REL_CM_IN, REL_L_M3],
  },

  "/conversor-m2-para-hectare": {
    path: "/conversor-m2-para-hectare",
    name: "Conversor m² para Hectare",
    intro:
      "Converta metros quadrados (m²) para hectares (ha) de forma rápida. Muito utilizado em agrimensura, agricultura e loteamentos.",
    context: [
      "O hectare é a unidade padrão para áreas rurais e loteamentos no Brasil. Escrituras, matrículas de imóveis e projetos agropecuários costumam informar a área em hectares, enquanto plantas urbanas trabalham em metros quadrados.",
      "Se você recebeu a medida em m² e precisa cadastrar em sistemas como CAR ou SIGEF (que exigem hectares), esta conversão é obrigatória. Divida por 10.000 e pronto.",
    ],
    whenToUse: [
      "Interpretar áreas de escrituras rurais.",
      "Cadastrar terrenos em sistemas ambientais.",
      "Comparar tamanhos de terrenos ou fazendas.",
    ],
    howItWorks: [
      "Digite o valor em metros quadrados.",
      "A calculadora divide o valor por 10.000 para obter o equivalente em hectares.",
    ],
    formula: {
      expression: "Hectares = Metros quadrados ÷ 10.000",
      legend: ["1 hectare (ha) = 10.000 m² = 100 m × 100 m."],
    },
    example: {
      scenario: "Terreno rural com 45.000 m².",
      steps: ["Hectares = 45.000 / 10.000 = 4,5 ha"],
      result: "O terreno tem 4,5 hectares.",
    },
    moreExamples: [
      {
        scenario: "Fazenda com 1.250.000 m².",
        steps: [
          "Hectares = 1.250.000 / 10.000 = 125 ha",
        ],
        result: "A fazenda possui 125 hectares (1,25 km²).",
      },
    ],
    tips: [
      "1 hectare equivale a um quadrado de 100 m de lado.",
      "10 hectares formam 1 km².",
      "No Brasil rural também se usa o alqueire, cujo tamanho varia conforme a região.",
    ],
    errors: [
      "Confundir hectare com are (1 are = 100 m²).",
      "Trocar a divisão pela multiplicação e obter um número 100 milhões de vezes maior.",
    ],
    table: {
      caption: "Equivalências rápidas",
      headers: ["Metros quadrados", "Hectares"],
      rows: [
        ["1.000 m²", "0,1 ha"],
        ["5.000 m²", "0,5 ha"],
        ["10.000 m²", "1 ha"],
        ["50.000 m²", "5 ha"],
        ["100.000 m²", "10 ha"],
      ],
    },
    faq: [
      {
        q: "Quantos m² tem 1 hectare?",
        a: "1 hectare = 10.000 m², equivalente a um quadrado de 100 m × 100 m.",
      },
      {
        q: "Como converter m² para hectare?",
        a: "Divida o valor em m² por 10.000. Por exemplo, 25.000 m² = 2,5 ha.",
      },
      {
        q: "Hectare é a mesma coisa que alqueire?",
        a: "Não. O alqueire varia por região: alqueire mineiro (48.400 m²), paulista (24.200 m²) e do norte (27.225 m²).",
      },
      {
        q: "Quantos hectares tem 1 km²?",
        a: "1 km² = 100 hectares.",
      },
    ],
    related: [REL_L_M3, REL_CM_IN, REL_PLACAS, REL_PISO],
  },

  "/conversor-cm-para-polegada": {
    path: "/conversor-cm-para-polegada",
    name: "Conversor cm para Polegada",
    intro:
      "Converta centímetros (cm) para polegadas (in) em tempo real. Útil para tubulações, monitores, TVs, ferramentas e projetos de marcenaria.",
    context: [
      "A polegada é a unidade padrão para telas (TVs, monitores, notebooks), tubulações hidráulicas e ferramentas importadas. Como a maior parte dos catálogos brasileiros mistura os dois sistemas, saber converter cm para polegada evita erros de compra.",
      "1 polegada equivale a exatamente 2,54 cm por definição internacional. Bitolas hidráulicas comerciais (½\", ¾\", 1\") são valores nominais — o diâmetro externo real pode ser ligeiramente diferente.",
    ],
    whenToUse: [
      "Escolher uma TV ou monitor pela diagonal.",
      "Comprar tubos, conexões e ferragens hidráulicas.",
      "Interpretar manuais técnicos em polegadas.",
    ],
    howItWorks: [
      "Digite o valor em centímetros.",
      "A calculadora divide o valor por 2,54 para obter o equivalente em polegadas.",
    ],
    formula: {
      expression: "Polegadas = Centímetros ÷ 2,54",
      legend: ["1 polegada (in) = 2,54 cm (padrão internacional)."],
    },
    example: {
      scenario: "TV com tela de 140 cm de diagonal.",
      steps: ["Polegadas = 140 / 2,54 = 55,12 in"],
      result: "A TV tem aproximadamente 55 polegadas.",
    },
    moreExamples: [
      {
        scenario: "Chapa de madeira com 244 cm de comprimento.",
        steps: [
          "Polegadas = 244 / 2,54 = 96,06 in",
        ],
        result: "A chapa tem aproximadamente 96 polegadas (8 pés).",
      },
    ],
    tips: [
      "Para tubos hidráulicos, arredonde para a bitola comercial mais próxima (1/2\", 3/4\", 1\").",
      "Uma polegada equivale a 25,4 mm.",
      "Monitores e TVs são medidos pela diagonal, não pela largura.",
    ],
    errors: [
      "Trocar 2,54 por 2,50 introduz erro de ~1,6%.",
      "Multiplicar em vez de dividir gera valores 6,4 vezes maiores.",
    ],
    table: {
      caption: "Conversões usuais",
      headers: ["Centímetros", "Polegadas"],
      rows: [
        ["1 cm", "0,39 in"],
        ["10 cm", "3,94 in"],
        ["30 cm", "11,81 in"],
        ["100 cm", "39,37 in"],
        ["254 cm", "100 in"],
      ],
    },
    faq: [
      {
        q: "Quantos cm tem 1 polegada?",
        a: "1 polegada equivale a 2,54 centímetros (ou 25,4 milímetros).",
      },
      {
        q: "Como converter cm para polegadas?",
        a: "Divida o valor em cm por 2,54. Por exemplo, 50 cm = 19,68 in.",
      },
      {
        q: "Qual polegada usar em tubulação hidráulica?",
        a: "As bitolas mais comuns em residências são 1/2\" (12,7 mm), 3/4\" (19 mm) e 1\" (25,4 mm).",
      },
      {
        q: "Quantas polegadas tem uma TV de 50 cm de largura?",
        a: "Uma TV de 50 cm de largura tem aproximadamente 19,7 polegadas — mas TVs são medidas pela diagonal.",
      },
    ],
    related: [REL_M2_HA, REL_L_M3, REL_PISO, REL_CONCRETO],
  },

  "/conversor-litros-para-m3": {
    path: "/conversor-litros-para-m3",
    name: "Conversor Litros para m³",
    intro:
      "Converta litros (L) para metros cúbicos (m³) instantaneamente. Muito usado em consumo de água, dimensionamento de caixas d'água e cálculos hidráulicos.",
    context: [
      "Caixas d'água, cisternas e reservatórios costumam ser vendidos em litros, mas cálculos hidráulicos e contas de água operam em metros cúbicos. Confundir as duas unidades pode gerar dimensionamento incorreto — por exemplo, comprar uma caixa 1.000 vezes menor do que o necessário.",
      "A relação é sempre a mesma: 1 m³ = 1.000 L. Ela vale para água, óleo, combustível ou qualquer outro líquido, já que unidades de volume não dependem da densidade.",
    ],
    whenToUse: [
      "Dimensionar caixas d'água e cisternas.",
      "Interpretar contas de água (cobradas em m³).",
      "Converter volumes em projetos hidráulicos.",
    ],
    howItWorks: [
      "Digite o valor em litros.",
      "A calculadora divide o valor por 1.000 para obter o equivalente em metros cúbicos.",
    ],
    formula: {
      expression: "Metros cúbicos = Litros ÷ 1.000",
      legend: ["1 m³ = 1.000 litros = 1.000 dm³."],
    },
    example: {
      scenario: "Caixa d'água de 5.000 litros.",
      steps: ["m³ = 5.000 / 1.000 = 5 m³"],
      result: "A caixa d'água tem 5 m³.",
    },
    moreExamples: [
      {
        scenario: "Cisterna residencial de 20.000 litros.",
        steps: [
          "m³ = 20.000 / 1.000 = 20 m³",
        ],
        result: "A cisterna comporta 20 m³ de água.",
      },
    ],
    tips: [
      "1 litro de água pesa aproximadamente 1 kg.",
      "Contas de água costumam ser cobradas em m³ — 1 m³ = 1.000 L.",
      "Para reservatórios grandes, dimensione considerando o consumo diário × 3 dias.",
    ],
    errors: [
      "Multiplicar por 1.000 em vez de dividir.",
      "Confundir m³ com m² — o primeiro é volume, o segundo é área.",
    ],
    table: {
      caption: "Equivalências úteis",
      headers: ["Litros", "Metros cúbicos"],
      rows: [
        ["100 L", "0,1 m³"],
        ["500 L", "0,5 m³"],
        ["1.000 L", "1 m³"],
        ["5.000 L", "5 m³"],
        ["10.000 L", "10 m³"],
      ],
    },
    faq: [
      {
        q: "Quantos litros tem 1 m³?",
        a: "1 metro cúbico equivale a 1.000 litros.",
      },
      {
        q: "Como converter litros para m³?",
        a: "Divida o valor em litros por 1.000. Por exemplo, 2.500 L = 2,5 m³.",
      },
      {
        q: "1 m³ de água pesa quanto?",
        a: "1 m³ de água pesa 1.000 kg (1 tonelada), pois a densidade da água é aproximadamente 1 kg/L.",
      },
      {
        q: "Contas de água são em litros ou m³?",
        a: "As concessionárias cobram por m³. Uma família de 4 pessoas consome cerca de 12 a 15 m³ por mês.",
      },
    ],
    related: [REL_M2_HA, REL_CM_IN, REL_CONCRETO, REL_PLACAS],
  },
};

export function getCalculator(path: string): CalculatorContent | undefined {
  return CALCULATORS[path];
}

const SITE_URL = "https://obrametrica.com.br";

/**
 * Gera o schema FAQPage (Schema.org) a partir da FAQ da calculadora.
 */
export function faqSchemaFor(path: string): Record<string, unknown> | undefined {
  const c = CALCULATORS[path];
  if (!c) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * Gera o schema HowTo (Schema.org) a partir dos passos de "howItWorks".
 */
export function howToSchemaFor(path: string): Record<string, unknown> | undefined {
  const c = CALCULATORS[path];
  if (!c) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Como usar a ${c.name}`,
    description: c.intro,
    step: c.howItWorks.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Passo ${i + 1}`,
      text,
    })),
  };
}

/**
 * Gera o schema WebApplication (Schema.org) para a calculadora.
 */
export function webAppSchemaFor(path: string): Record<string, unknown> | undefined {
  const c = CALCULATORS[path];
  if (!c) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: c.name,
    url: `${SITE_URL}${c.path}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    description: c.intro,
    offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
  };
}

/**
 * Retorna FAQ + HowTo + WebApplication schemas prontos para `extraSchemas`.
 */
export function allSchemasFor(path: string): Array<Record<string, unknown> | undefined> {
  return [faqSchemaFor(path), howToSchemaFor(path), webAppSchemaFor(path)];
}
