function LibraryCard({ item }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-lg font-semibold text-slate-800">{item.title}</p>
        <p className="mt-2 text-sm text-slate-500">{item.description}</p>
      </div>

      <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-500">
        {item.tag}
      </span>
    </div>
  );
}

export default LibraryCard;
