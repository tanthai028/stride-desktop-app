import { getTagMeta } from "../constants/libraryTags.js";

function LibraryCard({ item }) {
  const tagMeta = getTagMeta(item.tag);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 flex-1 truncate text-lg font-semibold text-slate-800">
          {item.title}
        </p>

        <span className="shrink-0 flex items-center rounded-full bg-pink-100 px-3 py-1 pl-2 text-xs font-medium text-pink-500">
          <span>{tagMeta.emoji}</span>
          <span>{tagMeta.label}</span>
        </span>
      </div>

      <p className="text-sm leading-6 text-slate-500 line-clamp-3">
        {item.description}
      </p>
    </div>
  );
}

export default LibraryCard;
