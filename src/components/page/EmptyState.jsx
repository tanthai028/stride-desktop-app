function EmptyState({ title, description, action }) {
  return (
    <div className="surface-card rounded-[28px] border border-dashed border-white/70 bg-white/50 p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
