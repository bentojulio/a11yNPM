// MultiSelectBootstrap.js
import React, { useState, useMemo, useRef, useEffect } from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import CloseButton from "react-bootstrap/CloseButton";
import Form from "react-bootstrap/Form";
import "./styles.css";

const useStableId = (prefix) => {
  const idRef = useRef(null);
  if (idRef.current === null) {
    idRef.current = `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
  }
  return idRef.current;
};

function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Pesquisar...",
  label,
  theme = "light",
  disabled = false,
  onInputChange,
  defaultValue = [],
  isValid = null,
  isInvalid = null,
  validFeedback = "",
  invalidFeedback = "",
  validateOnChange = true,
  noOptionsText = "Nenhuma opção encontrada",
  instructionsText = "Use as setas para navegar, Enter para selecionar.",
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const baseId = useStableId("multiselect");
  const listboxId = `${baseId}-listbox`;
  const labelId = `${baseId}-label`;
  const instructionsId = `${baseId}-instructions`;
  const getOptionId = (value) => `${baseId}-option-${String(value).replace(/\s/g, "_")}`;

  /** -------- validation logic -------- */
  const isDifferentFromDefault = useMemo(() => {
    if (!validateOnChange) return false;

    const currentSorted = [...value].sort().join(",");
    const defaultSorted = [...defaultValue].sort().join(",");

    return currentSorted !== defaultSorted;
  }, [value, defaultValue, validateOnChange]);

  const validationState = useMemo(() => {
    if (isValid !== null) return isValid;
    if (isInvalid !== null) return !isInvalid;
    if (validateOnChange) return isDifferentFromDefault;
    return null;
  }, [isValid, isInvalid, isDifferentFromDefault, validateOnChange]);

  /** Options not yet selected, filtered by search (selected ones only appear as badges) */
  const filtered = useMemo(
    () =>
      options.filter(
        (opt) =>
          !value.includes(opt.value) &&
          opt.label.toLowerCase().includes(search.toLowerCase())
      ),
    [search, options, value]
  );

  /** Add option to selection (selected options are removed via badge close) */
  const pick = (val) => {
    if (!value.includes(val)) {
      const opt = options.find((o) => o.value === val);
      const newValue = [...value, val];
      onChange(newValue);
      setAnnouncement(
        opt
          ? `${opt.label} adicionado. ${newValue.length} selecionado${newValue.length !== 1 ? "s" : ""}.`
          : ""
      );
    }
  };

  const remove = (val) => {
    const opt = options.find((o) => o.value === val);
    const newValue = value.filter((v) => v !== val);
    onChange(newValue);
    setAnnouncement(
      opt
        ? `${opt.label} removido. ${newValue.length} selecionado${newValue.length !== 1 ? "s" : ""}.`
        : ""
    );
  };

  /** Reset highlight when filtro muda ou o menu é fechado */
  useEffect(() => {
    if (!open) {
      setHighlightedIndex(-1);
      return;
    }
    // quando o utilizador altera a pesquisa, mantemos o índice atual;
    // só limpamos quando o menu fecha
  }, [open]);

  /** Announce list state when dropdown opens or filter changes */
  useEffect(() => {
    if (!open) return;
    if (filtered.length === 0) {
      setAnnouncement(noOptionsText);
    } else {
      setAnnouncement(
        `${filtered.length} opção${filtered.length !== 1 ? "ões" : ""} disponível${filtered.length !== 1 ? "is" : ""}.`
      );
    }
  }, [open, filtered.length, noOptionsText]);

  /** Clear announcement after read (screen readers need time to read) */
  useEffect(() => {
    if (!announcement) return;
    const t = setTimeout(() => setAnnouncement(""), 1500);
    return () => clearTimeout(t);
  }, [announcement]);

  /** Scroll highlighted option into view */
  useEffect(() => {
    if (!open || highlightedIndex < 0 || !listRef.current) return;
    const child = listRef.current.children[highlightedIndex];
    child?.scrollIntoView?.({ block: "nearest" });
  }, [highlightedIndex, open]);

  /** Keyboard: ArrowDown, ArrowUp, Enter, Escape */
  const onKeyDown = (e) => {
    const key = e.key;

    // Quando o menu está fechado, Enter / seta para baixo / espaço apenas abrem o menu
    if (!open) {
      if (key === "Enter" || key === "ArrowDown" || key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (key === "Escape") {
      e.preventDefault();
      // Apenas fecha a lista, mantendo o foco no input
      setOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    if (key === "ArrowDown" && filtered.length > 0) {
      e.preventDefault();
      setHighlightedIndex((i) => {
        // se ainda não há opção ativa, vamos para a primeira
        if (i < 0) return 0;
        // não fazemos wrap; ao chegar ao fim, permanecemos no último
        if (i < filtered.length - 1) return i + 1;
        return filtered.length - 1;
      });
      return;
    }

    if (key === "ArrowUp" && filtered.length > 0) {
      e.preventDefault();
      setHighlightedIndex((i) => {
        // se estamos na primeira opção e carregamos seta acima,
        // voltamos para a "textbox normal" (nenhuma opção ativa)
        if (i <= 0) return -1;
        return i - 1;
      });
      return;
    }

    if (key === "Enter" && filtered.length > 0 && highlightedIndex >= 0 && filtered[highlightedIndex]) {
      e.preventDefault();
      pick(filtered[highlightedIndex].value);
      return;
    }
  };

  /** Fecha o menu quando o foco sai totalmente do componente */
  const handleBlur = () => {
    // blur dispara antes do foco entrar no próximo elemento,
    // então usamos setTimeout para checar o foco final
    setTimeout(() => {
      if (!containerRef.current) return;
      const active = document.activeElement;
      if (active && !containerRef.current.contains(active)) {
        setOpen(false);
      }
    }, 0);
  };

  /** -------- fecha menu ao clicar fora -------- */
  useEffect(() => {
    const h = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selectedCount = value.length;
  const inputAriaLabel =
    label && selectedCount > 0
      ? `${label}, ${selectedCount} selecionado${selectedCount !== 1 ? "s" : ""}. ${placeholder}`
      : label
        ? `${label}. ${placeholder}`
        : selectedCount > 0
          ? `${selectedCount} selecionado${selectedCount !== 1 ? "s" : ""}. ${placeholder}`
          : placeholder;

  return (
    <div
      ref={containerRef}
      className="position-relative w-100"
      role="group"
      aria-labelledby={label ? labelId : undefined}
      onBlur={handleBlur}
    >
      {label && (
        <label id={labelId} className={`multi-select-label ${theme}`} htmlFor={undefined}>
          {label}
        </label>
      )}
      <span id={instructionsId} className="visually-hidden">
        {instructionsText}
      </span>

      {/* Campo de entrada + badges (InputGroup p/ manter estilo Bootstrap) */}
      <InputGroup
        className={`multi-select-input ${theme} ${disabled ? "disabled" : ""} ${
          validationState === true ? "is-valid" : ""
        } ${validationState === false ? "is-invalid" : ""}`}
        onClick={() => {
          !disabled && inputRef.current?.focus();
          setOpen(true);
        }}
      >
        {/* Selected items as badges */}
        <div className="d-flex flex-wrap align-items-center gap-1 ps-2">
          {value.map((v) => {
            const o = options.find((o) => o.value === v);
            if (!o) return null;
            return (
              <Badge pill bg="light" text="dark" key={v} className="d-flex badge-label">
                {o.label}
                <CloseButton
                  className="ms-1"
                  aria-label={`Remover ${o.label}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(v);
                  }}
                />
              </Badge>
            );
          })}
        </div>

        {/* Combobox: type to search, listbox announces options */}
        <FormControl
          ref={inputRef}
          className={`border-0 flex-grow-1 multi-search-input ${theme}`}
          placeholder={value.length === 0 ? placeholder : ""}
          value={search}
          disabled={disabled}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
            onInputChange?.(e.target.value);
          }}
          onFocus={() => !disabled && setOpen(true)}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listboxId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={
            open && filtered.length > 0 && highlightedIndex >= 0 && filtered[highlightedIndex]
              ? getOptionId(filtered[highlightedIndex].value)
              : undefined
          }
          aria-label={inputAriaLabel}
          aria-describedby={instructionsId}
        />
      </InputGroup>

      {/* Form validation feedback */}
      {validationState === true && validFeedback && (
        <Form.Control.Feedback type="valid" className="d-block">
          {validFeedback}
        </Form.Control.Feedback>
      )}
      {validationState === false && invalidFeedback && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {invalidFeedback}
        </Form.Control.Feedback>
      )}
      {validationState === false && !invalidFeedback && validateOnChange && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {isDifferentFromDefault 
            ? "" 
            : "Selecione pelo menos uma opção"}
        </Form.Control.Feedback>
      )}

      {/* Dropdown listbox: options announced by screen readers via aria-activedescendant */}
      {open && !disabled && (
        <ListGroup
          ref={listRef}
          id={listboxId}
          className={`multi-select-menu ${theme}`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label ? `Opções de ${label}` : "Opções"}
        >
          {filtered.length === 0 ? (
            <ListGroup.Item
              id={`${baseId}-no-options`}
              className="multi-select-no-options"
              role="option"
              aria-selected="false"
            >
              {noOptionsText}
            </ListGroup.Item>
          ) : (
            filtered.map((opt, index) => {
              const isHighlighted = index === highlightedIndex;
              return (
                <ListGroup.Item
                  action
                  key={opt.value}
                  id={getOptionId(opt.value)}
                  active={isHighlighted}
                  onClick={() => pick(opt.value)}
                  onKeyDown={(e) => e.key === "Enter" && pick(opt.value)}
                  role="option"
                  aria-selected="false"
                  tabIndex={-1}
                >
                  {opt.label}
                </ListGroup.Item>
              );
            })
          )}
        </ListGroup>
      )}

      {/* Live region: announces option count and selection changes to screen readers */}
      <div
        className="visually-hidden"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {announcement}
      </div>
    </div>
  );
}

export default MultiSelect;
export { MultiSelect };
