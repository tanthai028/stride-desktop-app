function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state-card surface-card text-center">
      <h3 className="empty-state-title text-lg font-semibold">{title}</h3>
      <p className="empty-state-description mx-auto mt-2 max-w-md text-sm">
        {description}
      </p>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
