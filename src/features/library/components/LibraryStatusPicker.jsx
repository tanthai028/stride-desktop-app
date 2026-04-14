import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function LibraryStatusPicker({
  statusOptions,
  selectedStatusValue,
  onStatusClick,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const selectedOption = useMemo(() => {
    return (
      statusOptions.find((option) => option.value === selectedStatusValue) ??
      statusOptions[0]
    );
  }, [selectedStatusValue, statusOptions]);

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

  function handleSelect(option) {
    onStatusClick(option);
    setIsOpen(false);
    triggerRef.current?.blur();
  }

  return (
    <div ref={containerRef} className="library-status-picker">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="library-tag-chip library-status-picker-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="library-status-picker-trigger-content">
          <span>{selectedOption?.emoji ?? "📌"}</span>
          <span className="library-status-picker-trigger-label">
            {selectedOption?.rawLabel ?? "Status"}
          </span>
        </span>

        <ChevronDown
          size={14}
          className={`library-status-picker-icon ${isOpen ? "is-open" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="select-menu-panel library-status-picker-panel">
          <div role="listbox" className="select-menu-options">
            {statusOptions.map((option) => {
              const isSelected = option.value === selectedStatusValue;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`select-menu-option library-status-picker-option ${isSelected ? "is-selected" : ""}`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="library-status-picker-option-content">
                    <span>{option.emoji}</span>
                    <span>{option.rawLabel}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default LibraryStatusPicker;
