function ActionButton({
  children,
  className = "",
  onClick,
  variant = "default",
  withIcon = false,
}) {
  const variantClassName =
    variant === "settings-reset"
      ? "settings-reset-button"
      : variant === "library-add"
        ? "library-add-button"
        : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`interactive surface-control primary-action-button ${
        withIcon ? "primary-action-button-with-icon" : ""
      } ${variantClassName} ${className}`}
    >
      {children}
    </button>
  );
}

export default ActionButton;
