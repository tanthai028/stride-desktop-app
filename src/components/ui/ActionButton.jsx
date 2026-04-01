function ActionButton({ children, className = "" }) {
  return (
    <button
      type="button"
      className={`w-full rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01] ${className}`}
    >
      {children}
    </button>
  );
}

export default ActionButton;