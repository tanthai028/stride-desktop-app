function JobDetailTextBlock({
  title,
  children,
  className = "",
  cardRef,
  onClick,
}) {
  return (
    <section
      ref={cardRef}
      className={`job-detail-card ${className}`.trim()}
      onClick={onClick}
    >
      <header className="job-detail-card-header">
        <h2>{title}</h2>
      </header>

      <div className="job-detail-card-body">{children}</div>
    </section>
  );
}

export default JobDetailTextBlock;
