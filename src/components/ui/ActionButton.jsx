const actionButtonBaseClassName =
  "interactive surface-control rounded-2xl px-4 py-3 text-sm font-medium transition-transform duration-150 hover:scale-[1.01]";

const actionButtonIconClassName = "inline-flex items-center gap-2";

const actionButtonVariantClassNames = {
  default: "",
  "settings-reset": "bg-violet-200 text-slate-700",
  "library-add": "bg-pink-200 text-slate-700",
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
