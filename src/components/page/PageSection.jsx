function PageSection({
  title,
  description,
  children,
  className = "",
  headerAction = null,
  headerLeading = null,
}) {
  return (
    <section className={`flex min-h-0 flex-1 flex-col ${className}`}>
      {title || description || headerAction || headerLeading ? (
        <div className="mb-3 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              {headerLeading ? (
                <div className="shrink-0">{headerLeading}</div>
              ) : null}

              <div className="min-w-0">
                {title ? (
                  <h3 className="section-title text-sm font-semibold">
                    {title}
                  </h3>
                ) : null}

                {description ? (
                  <p className="section-description mt-1 text-xs">
                    {description}
                  </p>
                ) : null}
              </div>
            </div>

            {headerAction ? (
              <div className="shrink-0">{headerAction}</div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  );
}

export default PageSection;
