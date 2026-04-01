export const defaultLibraryTags = [
  {
    value: "architecture",
    label: "🏗️ Architecture",
    rawLabel: "Architecture",
    emoji: "🏗️",
  },
  {
    value: "feature",
    label: "✨ Feature",
    rawLabel: "Feature",
    emoji: "✨",
  },
  {
    value: "pattern",
    label: "🧩 Pattern",
    rawLabel: "Pattern",
    emoji: "🧩",
  },
  {
    value: "system",
    label: "⚙️ System",
    rawLabel: "System",
    emoji: "⚙️",
  },
  {
    value: "ui",
    label: "🎨 UI",
    rawLabel: "UI",
    emoji: "🎨",
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
