import ProgressStat from "../ui/ProgressStat.jsx";

function DashboardPreview() {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-lg">
      <p className="mb-3 text-sm font-medium text-slate-400">
        Dashboard Preview
      </p>

      <div className="space-y-4">
        <ProgressStat
          label="Energy"
          value={82}
          trackClassName="bg-pink-100"
          barClassName="bg-pink-300"
        />

        <ProgressStat
          label="Focus"
          value={65}
          trackClassName="bg-violet-100"
          barClassName="bg-violet-300"
        />

        <ProgressStat
          label="Mood"
          value={91}
          trackClassName="bg-sky-100"
          barClassName="bg-sky-300"
        />
      </div>
    </div>
  );
}

export default DashboardPreview;