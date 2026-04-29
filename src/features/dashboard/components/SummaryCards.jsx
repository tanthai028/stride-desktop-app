function SummaryCards({ cards = [] }) {
  return (
    <div className="dashboard-summary-grid">
      {cards.map((card) => {
        const CardElement = card.onClick ? "button" : "div";

        return (
          <CardElement
            key={card.label}
            type={card.onClick ? "button" : undefined}
            onClick={card.onClick}
            className={`surface-card stat-card dashboard-metric-card ${
              card.onClick
                ? "dashboard-metric-card--button dashboard-clickable-card"
                : ""
            }`}
            data-tone={card.tone}
          >
            <div className="dashboard-metric-content">
              <p className={`stat-card-label stat-card-label--${card.tone}`}>
                {card.label}
              </p>

              <h2 className="stat-card-title dashboard-metric-value">
                {card.title}
              </h2>

              <p className="stat-card-description dashboard-metric-description">
                {card.description}
              </p>
            </div>
          </CardElement>
        );
      })}
    </div>
  );
}

export default SummaryCards;
