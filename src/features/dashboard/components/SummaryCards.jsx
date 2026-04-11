import StatCard from "../../../components/ui/StatCard.jsx";
import { summaryCards } from "../data/summaryCards.js";

function SummaryCards() {
  return (
    <div className="grid grid-cols-1 px-1 gap-5 mt-2 md:grid-cols-3">
      {summaryCards.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          title={card.title}
          description={card.description}
          tone={card.tone}
        />
      ))}
    </div>
  );
}

export default SummaryCards;
