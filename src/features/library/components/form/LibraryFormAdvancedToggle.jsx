function LibraryFormAdvancedToggle({ description, showAdvanced, onToggle }) {
  return (
    <div className="library-form-advanced-toggle">
      <div className="library-form-advanced-toggle-copy">
        <p className="library-form-advanced-toggle-title">Advanced fields</p>
        <p className="library-form-advanced-toggle-description">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={showAdvanced}
        className="library-form-advanced-toggle-button"
      >
        {showAdvanced ? "Hide" : "Show more"}
      </button>
    </div>
  );
}

export default LibraryFormAdvancedToggle;
