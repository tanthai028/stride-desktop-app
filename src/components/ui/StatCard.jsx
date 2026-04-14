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
      className={`surface-card stat-card page-card rounded-[28px] p-5 ${className}`}
    >
      <p
        className={`stat-card-label stat-card-label--${tone} mb-2 text-sm font-medium`}
      >
        {label}
      </p>
      <h2 className="stat-card-title text-xl font-semibold">{title}</h2>
      <p className="stat-card-description mt-2 text-sm">{description}</p>
    </div>
  );
}

export default StatCard;
