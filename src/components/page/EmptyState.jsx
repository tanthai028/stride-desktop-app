function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state-card surface-card text-center">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
