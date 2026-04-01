import ActionButton from "../ui/ActionButton.jsx";

function QuickActionsPanel() {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-lg">
      <p className="mb-3 text-sm font-medium text-slate-400">
        Quick Actions
      </p>

      <div className="space-y-3">
        <ActionButton className="bg-pink-200">New Entry</ActionButton>
        <ActionButton className="bg-violet-200">View Stats</ActionButton>
        <ActionButton className="bg-sky-200">Settings</ActionButton>
      </div>
    </div>
  );
}

export default QuickActionsPanel;