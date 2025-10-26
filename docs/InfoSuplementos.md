
# 📊 Avaliação de Usabilidade — Método e Procedimentos

## Objetivo
Avaliar a usabilidade e satisfação dos usuários em relação ao site de suplementos alimentares, utilizando um questionário baseado no SUS (System Usability Scale) e métricas de percepção.

## Estrutura do Formulário
O questionário (Google Forms) contém quatro seções principais:

1. **Perfil do Usuário**
   - Idade, escolaridade, frequência de consumo de suplementos, experiência em compras online.
2. **Acesso e Navegação**
   - Dispositivo utilizado (computador, celular, tablet);
   - Facilidade para encontrar produtos e compreender menus.
3. **Conteúdo e Informações**
   - Clareza das descrições dos produtos;
   - Qualidade das imagens;
   - Confiança nas informações nutricionais.
4. **Satisfação e Sugestões**
   - Grau de satisfação geral;
   - Probabilidade de recomendação;
   - Comentários abertos para melhorias.

## Procedimento
1. Usuários acessam o site e exploram as páginas principais.
2. Após a navegação, respondem ao formulário:  
   👉 [Formulário de Avaliação de Usabilidade](https://docs.google.com/forms/d/e/1FAIpQLSedlxPpPGPA_pH3LVlV916ewnRjc4-TeTUIGmWmLySkYKcMcA/viewform)
3. As respostas são armazenadas automaticamente no Google Sheets.
4. Os dados são exportados em `.csv` para análise no Excel, R ou Python.

## Métricas e Análises
- **SUS Score**: cálculo conforme metodologia oficial (escala 0–100);
- **Estatísticas descritivas**: média, desvio-padrão e distribuição das respostas;
- **Gráficos**: histogramas e boxplots das pontuações;
- **Análise qualitativa**: categorização dos comentários abertos.

## Interpretação
| Faixa SUS | Interpretação |
|------------|----------------|
| 0–50 | Usabilidade pobre |
| 50–70 | Aceitável / precisa de ajustes |
| 70–85 | Boa usabilidade |
| 85–100 | Excelente |

## Considerações Éticas
- Participação anônima e voluntária;
- Dados usados apenas para fins acadêmicos;
- Nenhuma informação sensível coletada.

---

> 🧩 **Observação:** Esta documentação faz parte do módulo de *avaliação de usabilidade* do projeto de construção do site de suplementos. Ela complementa as fases de design e desenvolvimento, fornecendo dados empíricos sobre a experiência real do usuário.
