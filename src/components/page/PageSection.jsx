function PageSection({ title, description, children, className = "" }) {
  return (
    <section className={`flex min-h-0 flex-1 flex-col ${className}`}>
      {title || description ? (
        <div className="mb-3 shrink-0">
          {title ? (
            <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
          ) : null}

          {description ? (
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  );
}

export default PageSection;
