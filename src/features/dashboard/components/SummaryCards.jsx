import StatCard from "../../../components/ui/StatCard.jsx";
import { summaryCards } from "../data/summaryCards.js";

function SummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 p-1">
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
