import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getHoverFeedbackHandlers } from "../../lib/uiFeedback.js";

const PANEL_EXIT_DURATION_MS = 180;

function SelectMenu({
  value,
  onChange,
  options = [],
  placeholder = "Status",
  className = "",
  onTriggerClick,
  interactionMode = "click",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPanelMounted, setIsPanelMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const shouldWaitForRehoverRef = useRef(false);
  const didLeaveAfterSelectRef = useRef(false);

  const isHoverMode = interactionMode === "hover";
  const selectedOption = options.find((option) => option.value === value);
  const SelectedIcon = selectedOption?.icon ?? null;
  const hoverFeedbackHandlers = getHoverFeedbackHandlers();

  const selectMenuClassName = [
    "select-menu",
    isOpen && "is-open",
    isClosing && "is-closing",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  function resetHoverLock() {
    shouldWaitForRehoverRef.current = false;
    didLeaveAfterSelectRef.current = false;
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (!containerRef.current?.contains(event.target)) {
        closeMenu();
        resetHoverLock();
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeMenu();
        resetHoverLock();
        triggerRef.current?.blur();
      }
    }

    function handleWindowBlur() {
      closeMenu();
      resetHoverLock();
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

  function clearCloseTimeout() {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }

  function openMenu() {
    if (isOpen && !isClosing) return;

    clearCloseTimeout();
    setIsClosing(false);
    setIsPanelMounted(true);

    requestAnimationFrame(() => {
      setIsOpen(true);
    });
  }

  function closeMenu() {
    if (!isOpen && !isPanelMounted) return;

    clearCloseTimeout();

    setIsOpen(false);
    setIsClosing(true);

    closeTimeoutRef.current = window.setTimeout(() => {
      setIsClosing(false);
      setIsPanelMounted(false);
      closeTimeoutRef.current = null;
    }, PANEL_EXIT_DURATION_MS);
  }

  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function handleSelect(nextValue, { closeMenuOnSelect = true } = {}) {
    onChange(nextValue);

    if (closeMenuOnSelect) {
      shouldWaitForRehoverRef.current = true;
      didLeaveAfterSelectRef.current = false;
      closeMenu();
      triggerRef.current?.blur();
    }
  }

  function handleTriggerClick() {
    if (isHoverMode) {
      if (onTriggerClick) {
        onTriggerClick(value);
        return;
      }

      const topOption = options[0];
      if (!topOption) return;

      handleSelect(topOption.value, { closeMenuOnSelect: false });
      return;
    }

    toggleMenu();
  }

  function tryOpenFromHover() {
    if (!isHoverMode) return;

    if (shouldWaitForRehoverRef.current) {
      if (!didLeaveAfterSelectRef.current) return;

      shouldWaitForRehoverRef.current = false;
      didLeaveAfterSelectRef.current = false;
    }

    if (!isOpen) openMenu();
  }

  function handleMouseEnter() {
    tryOpenFromHover();
  }

  function handleMouseLeave() {
    if (!isHoverMode) return;

    if (shouldWaitForRehoverRef.current) {
      didLeaveAfterSelectRef.current = true;
    }

    closeMenu();
  }

  function handleBlur(event) {
    if (!containerRef.current?.contains(event.relatedTarget)) {
      closeMenu();
    }
  }

  return (
    <div
      ref={containerRef}
      className={selectMenuClassName}
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
        {SelectedIcon ? (
          <SelectedIcon size={16} className="select-menu-option-icon" />
        ) : null}

        <span className="select-menu-label">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`select-menu-icon ${isOpen ? "is-open" : ""}`}
        />
      </button>

      {isPanelMounted ? (
        <>
          <div className="select-menu-hover-bridge" aria-hidden="true" />

          <div
            className={`select-menu-panel ${isOpen ? "is-entering" : ""} ${
              isClosing ? "is-exiting" : ""
            }`.trim()}
          >
            <div role="listbox" className="select-menu-options">
              {options.map((option) => {
                const isSelected = option.value === value;
                const OptionIcon = option.icon ?? null;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`select-menu-option ${
                      isSelected ? "is-selected" : ""
                    }`}
                    role="option"
                    aria-selected={isSelected}
                    {...hoverFeedbackHandlers}
                  >
                    {OptionIcon ? (
                      <OptionIcon
                        size={16}
                        className="select-menu-option-icon"
                      />
                    ) : null}

                    <span className="select-menu-option-label">
                      {option.label}
                    </span>
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
