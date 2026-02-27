import React, { useState } from "react";
import Select from "./index";

export default {
  title: "components/Atoms/Select",
  component: Select,
};

const options = [
  { value: "", label: "Selecione uma opção" },
  { value: "1", label: "Opção 1" },
  { value: "2", label: "Opção 2" },
  { value: "3", label: "Opção 3" },
];

const Template = (args) => {
  const [value, setValue] = useState(args.value || "");
  return (
    <Select
      {...args}
      value={value}
      onChange={setValue}
      onInputChange={(e) => {
        console.log("onInputChange", e);
      }}
      />
  );
};

export const Default = Template.bind({});
Default.args = {
  label: "Escolha uma opção",
  options,
  value: "",
  disabled: false,
  dark: "light",
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: "Desabilitado",
  options,
  value: "",
  disabled: true,
};

export const DarkTheme = Template.bind({});
DarkTheme.args = {
  label: "Tema Escuro", 
  options,
  value: "",
  darkTheme: "dark",
};

export const WithError = Template.bind({});
WithError.args = {
  label: "Campo com erro",
  options,
  value: "",
  error: "Este campo é obrigatório",
  id: "select-with-error",
};

export const Required = Template.bind({});
Required.args = {
  label: "Campo obrigatório",
  options,
  value: "",
  required: true,
  id: "required-select",
};

export const RequiredWithError = Template.bind({});
RequiredWithError.args = {
  label: "Campo obrigatório com erro",
  options,
  value: "",
  required: true,
  error: "Por favor, selecione uma opção",
  id: "required-select-error",
};

export const DarkThemeWithValidation = Template.bind({});
DarkThemeWithValidation.args = {
  label: "Tema escuro com validação",
  options,
  value: "",
  darkTheme: "dark",
  required: true,
  error: "Campo obrigatório no tema escuro",
  id: "dark-validation",
};

const manyOptions = [
  { value: "", label: "Selecione uma opção" },
  { value: "1", label: "Lisboa" },
  { value: "2", label: "Porto" },
  { value: "3", label: "Coimbra" },
  { value: "4", label: "Braga" },
  { value: "5", label: "Faro" },
  { value: "6", label: "Évora" },
  { value: "7", label: "Aveiro" },
  { value: "8", label: "Setúbal" },
  { value: "9", label: "Viseu" },
  { value: "10", label: "Leiria" },
];

export const Searchable = Template.bind({});
Searchable.args = {
  label: "Pesquisar cidade",
  options: manyOptions,
  value: "",
  isSearch: true,
  placeholder: "Escreva para pesquisar...",
  id: "searchable-select",
};

export const SearchableDark = Template.bind({});
SearchableDark.args = {
  label: "Pesquisar cidade (tema escuro)",
  options: manyOptions,
  value: "",
  isSearch: true,
  placeholder: "Escreva para pesquisar...",
  darkTheme: "dark",
  id: "searchable-select-dark",
};

export const SearchableWithError = Template.bind({});
SearchableWithError.args = {
  label: "Pesquisar cidade (com erro)",
  options: manyOptions,
  value: "",
  isSearch: true,
  placeholder: "Escreva para pesquisar...",
  error: "Por favor, selecione uma cidade",
  required: true,
  id: "searchable-select-error",
};