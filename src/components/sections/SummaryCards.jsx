import StatCard from "../ui/StatCard.jsx";

function SummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <StatCard
        label="Mood"
        title="Soft"
        description="Rounded corners, pastel gradients, smooth glassy cards."
        className="bg-pink-50/80"
        labelClassName="text-pink-500"
      />

      <StatCard
        label="Style"
        title="Modern"
        description="Clean spacing, simple hierarchy, subtle motion."
        className="bg-violet-50/80"
        labelClassName="text-violet-500"
      />

      <StatCard
        label="Feel"
        title="Desktop-ready"
        description="Easy React workflow, but runs as a desktop app."
        className="bg-sky-50/80"
        labelClassName="text-sky-500"
      />
    </div>
  );
}

export default SummaryCards;