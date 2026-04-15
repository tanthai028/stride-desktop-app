import ProgressStat from "../../../components/ui/ProgressStat.jsx";
import { dashboardStats } from "../data/dashboardStats.js";

function DashboardPreview() {
  return (
    <div className="surface-card dashboard-card">
      <p className="stat-card-description dashboard-card-title text-sm font-medium">
        Dashboard Preview
      </p>

      <div className="dashboard-preview-stats">
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
