import PageCard from "./PageCard.jsx";

function ItemGrid({ items, renderItem, onItemClick, onItemMiddleClick }) {
  function handleMiddleMouseDown(event) {
    if (event.button !== 1) return;

    event.preventDefault();
  }

  function handleMiddleClick(event, item) {
    if (event.button !== 1) return;

    event.preventDefault();
    event.stopPropagation();
    onItemMiddleClick?.(item);
  }

  return (
    <div className="grid overflow-visible grid-cols-[repeat(auto-fit,minmax(330px,1fr))] gap-4">
      {items.map((item) => (
        <PageCard
          key={item.id}
          className={`library-grid-card ${item.pinned ? "is-pinned" : ""} ${
            onItemClick ? "cursor-pointer" : ""
          }`}
          onClick={onItemClick ? () => onItemClick(item) : undefined}
          onMouseDown={handleMiddleMouseDown}
          onAuxClick={(event) => handleMiddleClick(event, item)}
          title={
            item.pinned
              ? "Middle-click to unpin"
              : "Middle-click to pin this application"
          }
        >
          {renderItem(item)}
        </PageCard>
      ))}
    </div>
  );
}

export default ItemGrid;
