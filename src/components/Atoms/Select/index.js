import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { FormSelect, Form } from "react-bootstrap";
import classNames from "classnames";
import "./styles.css";

const SearchableSelect = ({ options, value, onChange, onInputChange, label, disabled, darkTheme, error, required, id, placeholder, noResultsText, ...props }) => {
  const theme = darkTheme === "dark" ? "dark" : "";
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const justSelectedRef = useRef(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const selectedOption = options.find(opt => String(opt.value) === String(value));

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchTerm("");
    setActiveIndex(-1);
  }, []);

  const handleClickOutside = useCallback((e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      closeDropdown();
    }
  }, [closeDropdown]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (isOpen && activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex];
      if (activeEl) activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, isOpen]);

  const selectOption = (opt) => {
    onChange(opt.value);
    justSelectedRef.current = true;
    closeDropdown();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
 
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex(0);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(filteredOptions.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && filteredOptions[activeIndex]) {
          selectOption(filteredOptions[activeIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        closeDropdown();
        inputRef.current?.focus();
        break;
      case "Tab":
        closeDropdown();
        break;
      default:
        break;
    }
  };

  const handleFocus = () => {
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }
    setIsOpen(true);
    setSearchTerm("");
  };

  const inputClass = classNames(`ama-select-input ama-select-search-input ${theme}`, {
    "is-invalid": error,
  });

  const listboxId = `${id}-listbox`;
  const liveRegionId = `${id}-live`;
  const emptyText = noResultsText || "Sem resultados";

  return (
    <div className={`ama-select-atom ${theme}`} ref={containerRef}>
      {label && (
        <label className={`ama-select-label ${theme}`} htmlFor={id}>
          {label}
          {required && <span className="required-indicator"> *</span>}
        </label>
      )}
      <div className="ama-select-search-wrapper">
        <input
          {...props}
          ref={inputRef}
          id={id}
          type="text"
          className={inputClass}
          value={isOpen ? searchTerm : (selectedOption?.label || "")}
          placeholder={placeholder || ""}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          aria-activedescendant={isOpen && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
          aria-autocomplete="list"
          aria-required={required}
          aria-invalid={!!error}
          onClick={() => {
            if (!isOpen) {
              setIsOpen(true);
              setSearchTerm("");
            }
          }}
          onChange={(e) => {
            onInputChange(e);
          
            const val = isOpen ? e.target.value : "";
            setSearchTerm(val);
            if (!isOpen) setIsOpen(true);
            setActiveIndex(0);
          }}
   
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className={`ama-select-search-toggle ${theme}`}
          tabIndex={-1}
          aria-label={isOpen ? "Fechar lista" : "Abrir lista"}
          disabled={disabled}
          onMouseDown={(e) => {
            e.preventDefault();
            if (!disabled) {
              if (isOpen) {
                closeDropdown();
              } else {
                setIsOpen(true);
                setSearchTerm("");
              }
              inputRef.current?.focus();
            }
          }}
        >
          <span aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <ul
            ref={listRef}
            id={listboxId}
            className={`ama-select-dropdown ${theme}`}
            role="listbox"
            aria-label={label}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => (
                <li
                  key={opt.value}
                  id={`${id}-option-${index}`}
                  role="option"
                  className={classNames("ama-select-dropdown-item", {
                    active: index === activeIndex,
                    selected: String(opt.value) === String(value),
                  })}
                  aria-selected={String(opt.value) === String(value)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectOption(opt)}
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="ama-select-dropdown-empty" role="option" aria-selected="false" aria-disabled="true">
                {emptyText}
              </li>
            )}
          </ul>
        )}
      </div>

      <div
        id={liveRegionId}
        className="visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isOpen && searchTerm && (
          filteredOptions.length > 0
            ? `${filteredOptions.length} resultado${filteredOptions.length !== 1 ? "s" : ""} encontrado${filteredOptions.length !== 1 ? "s" : ""}`
            : emptyText
        )}
      </div>

      {error && (
        <Form.Control.Feedback type="invalid" className="select-error-feedback">
          {error}
        </Form.Control.Feedback>
      )}
    </div>
  );
};

let Select = ({ isSearch, ...props }) => {
  if (isSearch) {
    return <SearchableSelect {...props} />;
  }

  const { options, value, onChange, label, disabled, darkTheme, error, required, id, onInputChange, ...rest } = props;
  const theme = darkTheme === true ? "dark" : "";

  const selectClass = classNames(`ama-select-input ${theme}`, {
    "is-invalid": error,
  });

  return (
    <div className={`ama-select-atom ${theme}`}>
      {label && (
        <label className={`ama-select-label ${theme}`} htmlFor={id}>
          {label}
          {required && <span className="required-indicator"> *</span>}
        </label>
      )}
      <FormSelect
        className={selectClass}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        id={id}
        required={required}
        onInputChange={(e) => {
          onInputChange(e.target.value);
        }}
        {...rest}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </FormSelect>
      {error && (
        <Form.Control.Feedback type="invalid" className="select-error-feedback">
          {error}
        </Form.Control.Feedback>
      )}
    </div>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  darkTheme: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  id: PropTypes.string,
  isSearch: PropTypes.bool,
  placeholder: PropTypes.string,
  onInputChange: PropTypes.func,nge: PropTypes.func,
};

Select.defaultProps = {
  onInputChange: () => {},putChange: () => {},
};

Select = React.memo(Select);

export default Select;
export { Select };