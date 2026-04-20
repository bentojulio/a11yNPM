import React, { useState } from "react";
import { DashboardMenu } from "./";
import Documentation from './documentation.md'
export default {
    title: "components/Molecules/DashboardMenu",
    component: DashboardMenu,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: Documentation,
            },
        },
    },
};

const Template = (args) => {
    const [activeItem, setActiveItem] = useState(args.activeItem);

    const handleMenuItemClick = (obj) => {
        setActiveItem(obj);
    };

    return (
        <DashboardMenu
            {...args}
            activeItem={activeItem}
            onMenuItemClick={handleMenuItemClick}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    menuItems: [
        { id: "home", label: "Home", icon: "AMA-Casa-Line" },
        {
            id: "analytics",
            label: "Categorias",
            icon: "AMA-MarcadorGrande-Line",
            submenu: [
                { id: "cat1", label: "Categoria 1", icon: "AMA-Pasta-Line" },
                { id: "cat2", label: "Categoria 2", icon: "AMA-Pasta-Line" }
            ]
        },
        { id: "settings", label: "Diretórios", icon: "AMA-Pasta-Line" },
        { id: "profile", label: "Utilizadores", icon: "AMA-Casa-Line" },
        { id: "entity", label: "Entidades", icon: "AMA-Edificio-Line" },
        { id: "websites", label: "Sítios web", icon: "AMA-Globo-Line" },
        { id: "pages", label: "Páginas", icon: "AMA-Paginas-Line" }
    ],
    activeItem: { id: "home" },
};

/**
 * Replica o padrão oficial AMS (amagovpt.github.io/booka11y/ams-r).
 * Os emojis 📊 e 🆕 foram substituídos por ícones correspondentes do
 * design system (Gráfico e Mais).
 */
export const AMSPattern = Template.bind({});
AMSPattern.args = {
    menuItems: [
        { id: "inicio", label: "Início", icon: "AMA-Casa-Line" },
        {
            id: "ver",
            label: "Ver/Gerir",
            icon: "AMA-Grafico-Line",
            submenu: [
                { id: "v_global", label: "Global", icon: "AMA-Globo-Line" },
                { id: "v_diretorio", label: "Diretório", icon: "AMA-Pasta-Line" },
                { id: "v_categoria", label: "Categoria/Tag", icon: "AMA-MarcadorGrande-Line" },
                { id: "v_entidade", label: "Entidade", icon: "AMA-Edificio-Line" },
                { id: "v_sitio", label: "Sítio Web", icon: "AMA-Globo-Line" },
                { id: "v_pagina", label: "Página", icon: "AMA-Paginas-Line" },
                { id: "utilizadores", label: "Utilizadores", icon: "AMA-DuasPessoas-Line" },
                { id: "utilizadoresgov", label: "Utilizadores Gov", icon: "AMA-Equipa-Line" },
                { id: "crawlers", label: "Crawlers", icon: "AMA-Monitor-Line" }
            ]
        },
        {
            id: "criar",
            label: "Criar",
            icon: "AMA-Mais-Line",
            submenu: [
                { id: "novodiretorio", label: "Diretório", icon: "AMA-Pasta-Line" },
                { id: "novacategoria", label: "Categoria", icon: "AMA-MarcadorGrande-Line" },
                { id: "novaentidade", label: "Entidade", icon: "AMA-Edificio-Line" },
                { id: "novositioweb", label: "Sítio Web", icon: "AMA-Globo-Line" },
                { id: "novapagina", label: "Página", icon: "AMA-Paginas-Line" },
                { id: "novoutilizador", label: "Utilizador", icon: "AMA-DuasPessoas-Line" },
                { id: "novoutilizadorgov", label: "Utilizador Gov", icon: "AMA-Equipa-Line" }
            ]
        },
        {
            id: "dev",
            label: "Ferramentas de programador",
            icon: "AMA-Code-Line",
            submenu: [
                { id: "logs", label: "Logs", icon: "AMA-Doc-Line" }
            ]
        }
    ],
    activeItem: { id: "inicio" },
};

export const DarkTheme = Template.bind({});
DarkTheme.args = {
    menuItems: [
        { id: "home", label: "Home", icon: "AMA-Casa-Line" },
        { id: "analytics", label: "Categorias", icon: "AMA-MarcadorGrande-Line" },
        { id: "settings", label: "Diretórios", icon: "AMA-Pasta-Line" },
        { id: "profile", label: "Utilizadores", icon: "AMA-Casa-Line" },
        { id: "entity", label: "Entidades", icon: "AMA-Edificio-Line" },
        { id: "websites", label: "Sítios web", icon: "AMA-Globo-Line" },
        { id: "pages", label: "Páginas", icon: "AMA-Paginas-Line" }
    ],
    activeItem: { id: "home" },
    darkTheme: true,
};
