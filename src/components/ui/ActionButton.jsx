const actionButtonBaseClassName =
  "interactive surface-control rounded-2xl border px-4 py-3 text-sm font-medium transition-transform duration-150 hover:scale-[1.01]";

const actionButtonIconClassName = "inline-flex items-center gap-2";

const actionButtonVariantClassNames = {
  default: "border-white/40 text-slate-700 backdrop-blur-xl",
  "settings-reset":
    "border-violet-300/40 bg-violet-500/15 text-violet-600 backdrop-blur-xl shadow-[inset_0_0_0_1px_rgba(139,92,246,0.12),0_6px_18px_rgba(139,92,246,0.10)]",

  "library-add":
    "border-pink-300/40 bg-pink-500/15 text-pink-600 backdrop-blur-xl shadow-[inset_0_0_0_1px_rgba(236,72,153,0.12),0_6px_18px_rgba(236,72,153,0.10)]",
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
