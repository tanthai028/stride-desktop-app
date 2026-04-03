import ProgressStat from "../../../components/ui/ProgressStat.jsx";
import { dashboardStats } from "../data/dashboardStats.js";

function DashboardPreview() {
  return (
    <div className="surface-card rounded-[28px] border border-white/70 bg-white/70 p-5">
      <p className="mb-3 text-sm font-medium text-slate-400">
        Dashboard Preview
      </p>

      <div className="space-y-4">
        {dashboardStats.map((stat) => (
          <ProgressStat
            key={stat.label}
            label={stat.label}
            value={stat.value}
            trackClassName={stat.trackClassName}
            barClassName={stat.barClassName}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardPreview;
