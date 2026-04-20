import React from "react";
import { HtmlHorizontalBar } from "./index.js";

export default {
  title: "components/Molecules/HtmlHorizontalBar",
  component: HtmlHorizontalBar,
  parameters: {
    docs: {
      description: {
        component: `
An accessible horizontal bar chart built with **D3 scaleLinear** and an HTML/CSS layout.

### Accessibility approach
- Labels may contain HTML markup (\`<mark>\`, \`<code>\`, etc.) rendered via \`dangerouslySetInnerHTML\`
- A **visually-hidden \`<table>\`** exposes all data to screen readers (the visual chart is \`aria-hidden\`)
- A **\`<figure>\` + \`<figcaption>\`** wrapper provides semantic chart labelling
- D3's \`scaleLinear\` drives bar widths for accurate proportional rendering
        `,
      },
    },
  },
  argTypes: {
    color: { control: "color" },
    darkTheme: { control: { type: "select", options: ["light", "dark"] } },
  },
};

const goodPracticesLabels = [
  "Verifiquei que <mark>todos</mark> os elementos <code>&lt;li&gt;</code> estão contidos dentro de uma lista.",
  "Encontrei <mark>um</mark> elemento com a semântica de <code>banner</code>.",
  "Encontrei <mark>um</mark> elemento com a semântica de <code>main</code>.",
  "O atributo <code>content</code> da <code>meta</code> <mark>não impede</mark> o utilizador de fazer zoom.",
  "Verifiquei através do validador do W3C e constatei que <mark>não existem erros</mark> de HTML.",
  "Verifiquei que <mark>todas</mark> as listas só contêm itens de lista.",
  "Verifiquei que links com o mesmo nome acessível e contexto têm o mesmo destino.",
];

export const GoodPractices = {
  args: {
    title: "Boas Práticas de acessibilidade encontradas no sítio web",
    labels: goodPracticesLabels,
    data: [480, 120, 115, 95, 80, 450, 60],
    datasetLabel: "Nº de Páginas",
    color: "green",
    xAxisLabel: "Nº de Ocorrências",
    darkTheme: "light",
    labelHeader: "Prática",
  },
};

export const BadPractices = {
  args: {
    title: "Más Práticas de acessibilidade encontradas no sítio web",
    labels: goodPracticesLabels,
    data: [200, 310, 95, 45, 180, 820, 30],
    datasetLabel: "Nº de Páginas",
    color: "red",
    xAxisLabel: "Nº de Ocorrências",
    darkTheme: "light",
    labelHeader: "Prática",
  },
};

export const DarkTheme = {
  args: {
    title: "Boas Práticas (tema escuro)",
    labels: goodPracticesLabels,
    data: [480, 120, 115, 95, 80, 450, 60],
    datasetLabel: "Nº de Páginas",
    color: "#4caf50",
    xAxisLabel: "Nº de Ocorrências",
    darkTheme: "dark",
    labelHeader: "Prática",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
