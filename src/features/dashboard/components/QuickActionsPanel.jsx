import ActionButton from "../../../components/ui/ActionButton.jsx";
import { quickActions } from "../data/quickActions.js";

function QuickActionsPanel({ onAction }) {
  return (
    <div className="surface-card dashboard-card">
      <p className="stat-card-description dashboard-card-title text-sm font-medium">
        Quick Actions
      </p>

      <div className="dashboard-quick-actions">
        {quickActions.map((action) => (
          <ActionButton
            key={action.id}
            tone={action.tone}
            onClick={() => onAction(action.id)}
          >
            {action.label}
          </ActionButton>
        ))}
      </div>
    </div>
  );
}

export default QuickActionsPanel;
