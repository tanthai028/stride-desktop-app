export const defaultLibraryStatuses = [
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

export function normalizeStatusValue(status = "") {
  return status.trim().toLowerCase();
}

export function getStatusMeta(status = "") {
  const normalizedStatus = normalizeStatusValue(status);

  const matchedStatus = defaultLibraryStatuses.find(
    (option) => option.value === normalizedStatus,
  );

  if (matchedStatus) {
    return {
      value: matchedStatus.value,
      emoji: matchedStatus.emoji,
      label: matchedStatus.rawLabel,
      displayLabel: matchedStatus.label,
    };
  }

  return {
    value: normalizedStatus,
    emoji: "📌",
    label: status,
    displayLabel: `📌 ${status}`,
  };
}

export function getLibraryStatusOptions() {
  return defaultLibraryStatuses;
}
