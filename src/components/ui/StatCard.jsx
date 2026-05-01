function StatCard({
  label,
  title,
  description,
  tone = "pink",
  className = "",
}) {
  return (
    <div
      data-tone={tone}
      className={`surface-card stat-card page-card ${className}`}
    >
      <p className={`stat-card-label stat-card-label--${tone}`}>{label}</p>
      <h2 className="stat-card-title">{title}</h2>
      <p className="stat-card-description">{description}</p>
    </div>
  );
}

export default StatCard;
