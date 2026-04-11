const actionButtonVariantClassNames = {
  default: "action-button-default",
  "settings-reset": "action-button-settings-reset",
  "library-add": "action-button-library-add",
  pink: "action-button-pink",
  violet: "action-button-violet",
  sky: "action-button-sky",
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
        "action-button",
        withIcon ? "action-button--with-icon" : "",
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
