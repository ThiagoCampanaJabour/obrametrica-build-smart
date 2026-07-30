---
title: "Cálculo de drenagem, calhas e ralos"
description: "Estime vazões pluviais e dimensione calhas, ralos e condutos pelo método racional."
updated: "2026-07-30"
---

O dimensionamento de drenagem pluvial começa pela pergunta mais simples de todas:
quanta água chega ao sistema durante a chuva de projeto? A resposta vem do método
racional, que combina a área de contribuição, o tipo de superfície e a intensidade
de chuva da região em uma única expressão, `Q = C · i · A`.

Esta ferramenta organiza esse cálculo por bacias: você cadastra cada telhado, laje,
pátio ou jardim que contribui para um mesmo ponto de despejo, escolhe a intensidade
de chuva a partir de presets por cidade e duração, e recebe a vazão em litros por
segundo. A partir daí, o sistema sugere a seção mínima de calha, o número de ralos
ou grelhas e o menor diâmetro comercial de conduto capaz de escoar a vazão na
declividade informada, usando a fórmula de Manning.

Os resultados incluem avisos contextuais: velocidade abaixo de 0,6 m/s indica risco
de sedimentação; velocidade muito alta indica abrasão; declividade abaixo de 0,5%
é sinalizada como crítica. Tudo pode ser exportado em CSV ou JSON para compor o
memorial de quantitativos da obra.

Trata-se de uma estimativa preliminar. O projeto hidráulico executivo deve seguir a
ABNT NBR 10844 e ser assinado por profissional habilitado.
