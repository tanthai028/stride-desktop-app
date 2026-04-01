function ProgressStat({ label, value, barClassName, trackClassName }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-slate-400">{value}%</span>
      </div>

      <div className={`h-3.5 rounded-full ${trackClassName}`}>
        <div
          className={`h-3.5 rounded-full ${barClassName}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressStat;
