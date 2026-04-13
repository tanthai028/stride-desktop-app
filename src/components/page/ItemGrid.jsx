import PageCard from "./PageCard.jsx";

function ItemGrid({ items, renderItem, onItemClick }) {
  return (
    <div className="grid overflow-visible grid-cols-[repeat(auto-fit,minmax(330px,1fr))] gap-4">
      {items.map((item) => (
        <PageCard
          key={item.id}
          className={`library-grid-card ${onItemClick ? "cursor-pointer" : ""}`}
          onClick={onItemClick ? () => onItemClick(item) : undefined}
        >
          {renderItem(item)}
        </PageCard>
      ))}
    </div>
  );
}

export default ItemGrid;
