import StatCard from "../ui/StatCard.jsx";
import { summaryCards } from "../../data/summaryCards.js";

function SummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {summaryCards.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          title={card.title}
          description={card.description}
          className={card.className}
          labelClassName={card.labelClassName}
        />
      ))}
    </div>
  );
}

export default SummaryCards;