# DashboardMenu

O `DashboardMenu` é um componente de menu lateral usado em dashboards para navegação entre secções/páginas. Segue o padrão oficial do livro de acessibilidade AMA — ver referência em [amagovpt.github.io/booka11y/ams-r](https://amagovpt.github.io/booka11y/ams-r/index.html).

<br>

## Estrutura (padrão AMS)

```
<aside id="asideCol">
  <nav aria-label="menu principal do AMS">
    <button id="toggleMenu" aria-controls="menu-ams" aria-expanded="true">Menu</button>

    <ul id="menu-ams" aria-label="opções AMS">
      <!-- item simples ativo: não é link, apenas texto descritivo -->
      <li aria-current="page">…</li>

      <!-- item com submenu -->
      <li>
        <button
          id="menu-ver"
          aria-controls="submenu-ver"
          aria-expanded="false"
          aria-label="Ver/Gerir, contém submenu, atualmente fechado"
          data-label="Ver/Gerir"
        >Ver/Gerir <span class="indicator" aria-hidden="true">▼</span></button>
        <ul id="submenu-ver" aria-labelledby="menu-ver" hidden aria-hidden="true">
          <li><a href="…">…</a></li>
        </ul>
      </li>
    </ul>
  </nav>
</aside>
```

<br>

## Acessibilidade

- O `<nav>` tem `aria-label="menu principal do AMS"`.
- O botão **Menu** (`#toggleMenu`) colapsa/expande o aside através de `aria-expanded` e do atributo `hidden` na lista.
- Cada botão que abre um submenu expõe:
  - `id` único (`menu-{id}`),
  - `aria-controls` a apontar para o submenu,
  - `aria-expanded` com o estado atual,
  - `aria-label` no formato **"{rótulo}, contém submenu, atualmente {aberto|fechado}"**,
  - `data-label` com o rótulo base.
- O submenu tem `aria-labelledby` a referenciar o botão e, quando fechado, recebe **tanto `hidden` como `aria-hidden="true"`** (workaround VoiceOver + Safari, onde o `hidden` sozinho não é refletido corretamente na árvore de acessibilidade).
- O item atualmente ativo usa `aria-current="page"` e **não é um link** — é apenas texto descritivo (o utilizador já está nessa página). Isto aplica-se tanto a itens de topo como a itens de submenu.
- O indicador (`<span class="indicator">`) é rodado via CSS com base em `aria-expanded`, dispensando troca de marcação.
- Os ícones decorativos têm `aria-hidden="true"`.
- Navegação por teclado: `Tab` percorre os itens, `Enter`/`Espaço` ativa.

<br>

## Props

#### menuItems (obrigatório)
Array de objetos que define a estrutura do menu. Cada item aceita:
- `id` (string, obrigatório): identificador único.
- `label` (string, obrigatório): texto visível.
- `icon` (string, obrigatório): nome do ícone do design system (ex.: `AMA-Casa-Line`).
- `submenu` (array, opcional): lista de subitens com a mesma forma (sem aninhamento adicional).

#### onMenuItemClick (obrigatório)
Função invocada quando um item é clicado. Recebe o objeto completo do item.

#### activeItem
Item atualmente ativo. Aceita o objeto (`{ id: "home" }`) ou apenas o `id` em string.

#### darkTheme
`boolean` — ativa a variante dark.

#### basename
`string` — `basename` opcional para o `BrowserRouter` interno.

<br>

## Mapeamento emoji → ícone

A referência AMS usa emojis (📊, 🆕) nas labels. No design system, substituímos por ícones equivalentes:

| Intenção | Emoji AMS | Ícone DS |
|---|---|---|
| Ver / analisar dados | 📊 | `AMA-Grafico-Line` |
| Criar / novo | 🆕 | `AMA-Mais-Line` |
| Ferramentas de programador | — | `AMA-Code-Line` |
| Colapsar/expandir aside | ◀ / ▶ | `AMA-SetaEsq-Line` / `AMA-SetaDir-Line` |
| Indicador submenu | ▼ | `AMA-SetaBaixo2-Line` (rodado via CSS) |

<br>

## Exemplo

```javascript
menuItems: [
    { id: "inicio", label: "Início", icon: "AMA-Casa-Line" },
    {
        id: "ver", label: "Ver/Gerir", icon: "AMA-Grafico-Line",
        submenu: [
            { id: "v_diretorio", label: "Diretório", icon: "AMA-Pasta-Line" },
            { id: "v_categoria", label: "Categoria/Tag", icon: "AMA-MarcadorGrande-Line" }
        ]
    },
    {
        id: "criar", label: "Criar", icon: "AMA-Mais-Line",
        submenu: [
            { id: "novodiretorio", label: "Diretório", icon: "AMA-Pasta-Line" }
        ]
    }
]
```
