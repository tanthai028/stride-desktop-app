export const defaultLibraryTags = [
  {
    value: "wishlist",
    label: "⭐ Wishlist",
    rawLabel: "Wishlist",
    emoji: "⭐",
  },
  {
    value: "applied",
    label: "📨 Applied",
    rawLabel: "Applied",
    emoji: "📨",
  },
  {
    value: "oa",
    label: "🧠 OA",
    rawLabel: "OA",
    emoji: "🧠",
  },
  {
    value: "interview",
    label: "🎤 Interview",
    rawLabel: "Interview",
    emoji: "🎤",
  },
  {
    value: "offer",
    label: "🎉 Offer",
    rawLabel: "Offer",
    emoji: "🎉",
  },
  {
    value: "rejected",
    label: "❌ Rejected",
    rawLabel: "Rejected",
    emoji: "❌",
  },
];

export function normalizeTagValue(tag = "") {
  return tag.trim().toLowerCase();
}

export function getTagMeta(tag = "") {
  const normalizedTag = normalizeTagValue(tag);

  const matchedTag = defaultLibraryTags.find(
    (option) => option.value === normalizedTag,
  );

  if (matchedTag) {
    return {
      value: matchedTag.value,
      emoji: matchedTag.emoji,
      label: matchedTag.rawLabel,
      displayLabel: matchedTag.label,
    };
  }

  return {
    value: normalizedTag,
    emoji: "🏷️",
    label: tag,
    displayLabel: `🏷️ ${tag}`,
  };
}

export function getLibraryTagOptions() {
  return defaultLibraryTags;
}
