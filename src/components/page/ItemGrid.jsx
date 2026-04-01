import PageCard from "./PageCard.jsx";

function ItemGrid({ items, renderItem }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item) => (
        <PageCard key={item.id}>
          {renderItem(item)}
        </PageCard>
      ))}
    </div>
  );
}

export default ItemGrid;