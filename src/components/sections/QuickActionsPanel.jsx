import ActionButton from "../ui/ActionButton.jsx";
import { quickActions } from "../../data/quickActions.js";

function QuickActionsPanel({ onAction }) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-lg">
      <p className="mb-3 text-sm font-medium text-slate-400">
        Quick Actions
      </p>

      <div className="space-y-3">
        {quickActions.map((action) => (
          <ActionButton
            key={action.id}
            className={action.className}
            onClick={() => onAction?.(action.id)}
          >
            {action.label}
          </ActionButton>
        ))}
      </div>
    </div>
  );
}

export default QuickActionsPanel;