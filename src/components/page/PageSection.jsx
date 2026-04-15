function PageSection({
  title,
  description,
  children,
  className = "",
  headerAction = null,
  headerLeading = null,
}) {
  return (
    <section className={`page-section ${className}`.trim()}>
      {title || description || headerAction || headerLeading ? (
        <div className="page-section-header">
          <div className="page-section-header-row">
            <div className="page-section-header-main">
              {headerLeading ? (
                <div className="page-section-header-leading">
                  {headerLeading}
                </div>
              ) : null}

              <div className="page-section-header-copy">
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
              <div className="page-section-header-action">{headerAction}</div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="page-section-body">{children}</div>
    </section>
  );
}

export default PageSection;
