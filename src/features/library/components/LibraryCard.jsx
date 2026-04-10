import { getTagMeta } from "../constants/libraryTags.js";

function LibraryCard({ item }) {
  const tagMeta = getTagMeta(item.tag);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <p className="library-card-title min-w-0 flex-1 truncate text-lg font-semibold">
          {item.title}
        </p>

        <span className="library-card-chip shrink-0 flex items-center rounded-full px-3 py-1 pl-2 text-xs font-medium">
          <span>{tagMeta.emoji}</span>
          <span>{tagMeta.label}</span>
        </span>
      </div>

      <p className="library-card-description line-clamp-3 text-sm leading-6">
        {item.description}
      </p>
    </div>
  );
}

export default LibraryCard;
