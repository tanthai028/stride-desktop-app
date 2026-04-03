import ActionButton from "../../../components/ui/ActionButton.jsx";
import { quickActions } from "../data/quickActions.js";

function QuickActionsPanel({ onAction }) {
  return (
    <div className="surface-card rounded-[28px] border border-white/70 bg-white/70 p-5">
      <p className="mb-3 text-sm font-medium text-slate-400">Quick Actions</p>

      <div className="flex flex-col gap-3">
        {quickActions.map((action) => (
          <ActionButton
            key={action.id}
            className={action.className}
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
