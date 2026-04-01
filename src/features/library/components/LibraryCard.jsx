import { getTagMeta } from "../constants/libraryTags.js";

function LibraryCard({ item }) {
  const tagMeta = getTagMeta(item.tag);

  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-lg font-semibold text-slate-800">{item.title}</p>
        <p className="mt-2 text-sm text-slate-500">{item.description}</p>
      </div>

      <span className="flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-500">
        <span>{tagMeta.emoji}</span>
        <span>{tagMeta.label}</span>
      </span>
    </div>
  );
}

export default LibraryCard;
