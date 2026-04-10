function ProgressStat({ label, value, tone = "pink" }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="progress-stat-value text-sm">{value}%</span>
      </div>

      <div
        className={`progress-stat-track progress-stat-track--${tone} h-3.5 rounded-full`}
      >
        <div
          className={`progress-stat-bar progress-stat-bar--${tone} h-3.5 rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressStat;
