import ProgressStat from "../../../components/ui/ProgressStat.jsx";
import { dashboardStats } from "../data/dashboardStats.js";

function DashboardPreview() {
  return (
    <div className="surface-card rounded-[28px] p-5">
      <p className="stat-card-description mb-3 text-sm font-medium">
        Dashboard Preview
      </p>

      <div className="space-y-4">
        {dashboardStats.map((stat) => (
          <ProgressStat
            key={stat.label}
            label={stat.label}
            value={stat.value}
            tone={stat.tone}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardPreview;
