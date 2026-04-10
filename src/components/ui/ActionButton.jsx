const actionButtonBaseClassName =
  "interactive surface-control rounded-2xl border px-4 py-3 text-sm font-medium transition-transform duration-150 hover:scale-[1.01]";

const actionButtonIconClassName = "inline-flex items-center gap-2";

const actionButtonVariantClassNames = {
  default: "action-button-default",
  "settings-reset": "action-button-settings-reset",
  "library-add": "action-button-library-add",
};

function ActionButton({
  children,
  className = "",
  onClick,
  variant = "default",
  withIcon = false,
}) {
  const variantClassName =
    actionButtonVariantClassNames[variant] ??
    actionButtonVariantClassNames.default;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${actionButtonBaseClassName} ${
        withIcon ? actionButtonIconClassName : ""
      } ${variantClassName} ${className}`}
    >
      {children}
    </button>
  );
}

export default ActionButton;
