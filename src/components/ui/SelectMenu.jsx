import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getHoverFeedbackHandlers } from "../../lib/uiFeedback.js";

function SelectMenu({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);
  const hoverFeedbackHandlers = getHoverFeedbackHandlers();

  useEffect(() => {
    function handleClickOutside(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.blur();
      }
    }

    function handleWindowBlur() {
      setIsOpen(false);
      triggerRef.current?.blur();
    }

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  function handleSelect(nextValue, { closeMenu = true } = {}) {
    onChange(nextValue);

    if (closeMenu) {
      setIsOpen(false);
      triggerRef.current?.blur();
    }
  }

  function handleTriggerClick() {
    const topOption = options[0];

    if (!topOption) {
      return;
    }

    handleSelect(topOption.value, { closeMenu: false });
  }

  function handleMouseEnter() {
    setIsOpen(true);
  }

  function handleMouseLeave() {
    setIsOpen(false);
  }

  function handleBlur(event) {
    if (!containerRef.current?.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  }

  return (
    <div
      ref={containerRef}
      className={`select-menu ${isOpen ? "is-open" : ""} ${className}`.trim()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onBlur={handleBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        className="select-menu-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        {...hoverFeedbackHandlers}
      >
        <span className="select-menu-label">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`select-menu-icon ${isOpen ? "is-open" : ""}`}
        />
      </button>

      {isOpen ? (
        <>
          <div className="select-menu-hover-bridge" aria-hidden="true" />

          <div className="select-menu-panel">
            <div role="listbox" className="select-menu-options">
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`select-menu-option ${isSelected ? "is-selected" : ""}`}
                    role="option"
                    aria-selected={isSelected}
                    {...hoverFeedbackHandlers}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default SelectMenu;
