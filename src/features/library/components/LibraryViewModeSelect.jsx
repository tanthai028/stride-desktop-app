import SelectMenu from "../../../components/ui/SelectMenu.jsx";

function cycleOption(currentValue, options, onChange) {
  const currentIndex = options.findIndex(
    (option) => option.value === currentValue,
  );

  if (currentIndex < 0 || options.length === 0) return;

  const nextIndex = (currentIndex + 1) % options.length;
  onChange(options[nextIndex].value);
}

function LibraryViewModeSelect({ value, onChange, options }) {
  function handleTriggerClick() {
    cycleOption(value, options, onChange);
  }

  return (
    <SelectMenu
      value={value}
      onChange={onChange}
      options={options}
      className="library-view-mode-select library-view-mode-select-icon-only"
      onTriggerClick={handleTriggerClick}
      interactionMode="hover"
    />
  );
}

export default LibraryViewModeSelect;
