import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function SelectMenu({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  className = "",
  isDarkMode = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

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
  }

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`interactive-input inline-flex h-[44px] min-w-[120px] w-full items-center justify-between gap-2 rounded-2xl border px-4 text-sm font-medium shadow-sm outline-none transition ${
          isOpen
            ? "border-violet-300 ring-2 ring-violet-200/40"
            : isDarkMode
              ? "border-white/10"
              : "border-white/70"
        } ${
          isDarkMode
            ? "bg-slate-900/80 text-slate-100"
            : "bg-white/70 text-slate-700"
        }`}
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
        <div
          className={`absolute right-0 z-30 mt-2 w-full rounded-2xl border p-1.5 shadow-xl backdrop-blur-xl ${
            isDarkMode
              ? "border-white/10 bg-slate-900/95"
              : "border-white/70 bg-white/90"
          }`}
        >
          <div role="listbox" className="space-y-1">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`interactive flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    isSelected
                      ? isDarkMode
                        ? "bg-white/10 text-white"
                        : "bg-pink-200 text-slate-800"
                      : isDarkMode
                        ? "text-slate-200 hover:bg-white/10 hover:text-white"
                        : "text-slate-600"
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
