---
title: "Perda de carga em tubulações"
description: "Calcule perdas por atrito e localizadas em tubulações de água por Darcy-Weisbach ou Hazen-Williams."
slug: "hidraulica"
updated: "2026-08-06"
---

A perda de carga é a energia que a água perde ao vencer o atrito com a parede do tubo e as
singularidades do traçado (curvas, válvulas, conexões). Ela determina a pressão disponível no ponto
de consumo e, em sistemas de recalque, a altura manométrica que a bomba precisa vencer.

Esta ferramenta calcula, trecho a trecho, a velocidade do escoamento, o número de Reynolds, o fator
de atrito e a perda resultante em metros de coluna d'água (m.c.a.) e em pascal. Você escolhe entre
**Darcy-Weisbach** — com fator de atrito por Colebrook-White (iterativo) ou Swamee-Jain (explícito)
— e **Hazen-Williams**, tradicional em redes de água potável. Também é possível somar trechos em
série, incluir perdas localizadas por coeficiente K e estimar a potência do conjunto motobomba.

Os resultados são estimativas de anteprojeto: o projeto hidráulico executivo deve ser verificado por
profissional habilitado, conforme a ABNT NBR 5626 e as normas aplicáveis.
