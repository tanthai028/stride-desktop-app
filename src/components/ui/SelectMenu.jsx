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
  const selectedIndex = options.findIndex((option) => option.value === value);
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

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSelect(nextValue) {
    onChange(nextValue);
    setIsOpen(false);
    triggerRef.current?.blur();
  }

  function handleWheel(event) {
    if (!options.length) {
      return;
    }

    event.preventDefault();

    const currentIndex = selectedIndex >= 0 ? selectedIndex : 0;

    if (event.deltaY > 0) {
      const nextIndex = Math.min(currentIndex + 1, options.length - 1);
      if (nextIndex !== currentIndex) {
        onChange(options[nextIndex].value);
      }
      return;
    }

    if (event.deltaY < 0) {
      const nextIndex = Math.max(currentIndex - 1, 0);
      if (nextIndex !== currentIndex) {
        onChange(options[nextIndex].value);
      }
    }
  }

  return (
    <div ref={containerRef} className={`select-menu ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        onWheel={handleWheel}
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
      ) : null}
    </div>
  );
}

export default SelectMenu;
