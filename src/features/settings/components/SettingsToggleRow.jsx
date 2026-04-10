function SettingsToggleRow({ title, description, checked, onToggle }) {
  return (
    <div className="settings-card rounded-2xl px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="settings-card-title text-sm font-semibold">{title}</p>
          <p className="settings-card-description mt-1 text-xs">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-pressed={checked}
          className={`settings-toggle interactive relative mt-1 h-7 w-12 rounded-full ${
            checked ? "is-checked" : ""
          }`}
        >
          <span
            className={`settings-toggle-thumb absolute top-1 h-5 w-5 rounded-full ${
              checked ? "is-checked" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default SettingsToggleRow;
