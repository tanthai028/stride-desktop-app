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
    <div ref={containerRef} className="relative w-fit shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="library-tag-chip inline-flex h-9 items-center gap-1.5 px-2.5 py-1 text-sm leading-none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1">
          <span>{selectedOption?.emoji ?? "📌"}</span>
          <span className="whitespace-nowrap">
            {selectedOption?.rawLabel ?? "Status"}
          </span>
        </span>

        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div className="select-menu-panel absolute right-0 top-full z-30 mt-2 min-w-[130px] rounded-2xl">
          <div role="listbox" className="space-y-1">
            {statusOptions.map((option) => {
              const isSelected = option.value === selectedStatusValue;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`select-menu-option flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm ${
                    isSelected ? "is-selected" : ""
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="flex items-center gap-2 whitespace-nowrap">
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
