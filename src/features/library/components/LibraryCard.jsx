function getTagDisplay(tag) {
  const normalizedTag = tag.toLowerCase();

  if (normalizedTag === "pattern") {
    return (
      <>
        🧩 <span>Pattern</span>
      </>
    );
  }

  if (normalizedTag === "feature") {
    return (
      <>
        ✨ <span>Feature</span>
      </>
    );
  }

  if (normalizedTag === "architecture") {
    return (
      <>
        🏗️ <span>Architecture</span>
      </>
    );
  }

  if (normalizedTag === "system") {
    return (
      <>
        ⚙️ <span>System</span>
      </>
    );
  }

  return (
    <>
      🏷️ <span>{tag}</span>
    </>
  );
}

function LibraryCard({ item }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-lg font-semibold text-slate-800">{item.title}</p>
        <p className="mt-2 text-sm text-slate-500">{item.description}</p>
      </div>

      <span className="flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-500">
        {getTagDisplay(item.tag)}
      </span>
    </div>
  );
}

export default LibraryCard;
