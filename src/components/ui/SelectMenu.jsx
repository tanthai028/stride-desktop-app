import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`select-menu-trigger surface-control interactive-input inline-flex h-[44px] min-w-[120px] w-full items-center justify-between gap-2 rounded-2xl border border-white/70 px-4 text-sm font-medium outline-none transition bg-white/70 text-slate-700`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex-1 text-center">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div className="select-menu-panel surface-floating absolute right-0 z-30 mt-2 w-full rounded-2xl border border-white/70 bg-white/90 p-1.5">
          <div role="listbox" className="space-y-1">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`select-menu-option interactive flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    isSelected
                      ? "is-selected bg-pink-200 text-slate-800"
                      : "text-slate-600 hover:bg-white/70 hover:text-slate-800"
                  }`}
                  role="option"
                  aria-selected={isSelected}
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
