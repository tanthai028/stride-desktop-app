const actionButtonBaseClassName =
  "interactive surface-control rounded-2xl border px-4 py-3 text-sm font-medium transition-transform duration-150 hover:scale-[1.01]";

const actionButtonIconClassName = "inline-flex items-center gap-2";

const actionButtonVariantClassNames = {
  default: "button-default",
  "settings-reset": "action-button-settings-reset",
  "library-add": "action-button-library-add",
  pink: "button-pink",
  violet: "button-violet",
  sky: "button-sky",
};

function ActionButton({
  children,
  className = "",
  onClick,
  variant = "default",
  withIcon = false,
  type = "button",
}) {
  const variantClassName =
    actionButtonVariantClassNames[variant] ||
    actionButtonVariantClassNames.default;

  return (
    <button
      type={type}
      onClick={onClick}
      className={[
        actionButtonBaseClassName,
        withIcon ? actionButtonIconClassName : "",
        variantClassName,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

export default ActionButton;
