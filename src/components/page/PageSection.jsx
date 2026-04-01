function PageSection({ title, description, children }) {
  return (
    <section>
      {title || description ? (
        <div className="mb-3">
          {title ? (
            <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
          ) : null}

          {description ? (
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          ) : null}
        </div>
      ) : null}

      {children}
    </section>
  );
}

export default PageSection;
