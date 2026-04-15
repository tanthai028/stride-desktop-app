import StatCard from "../../../components/ui/StatCard.jsx";
import { summaryCards } from "../data/summaryCards.js";

function SummaryCards() {
  return (
    <div className="dashboard-summary-grid">
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
