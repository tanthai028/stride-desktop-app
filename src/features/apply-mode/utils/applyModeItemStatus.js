export function isUnapplied(item) {
  return (
    String(item?.status ?? "")
      .trim()
      .toLowerCase() === "unapplied"
  );
}

export function isApplied(item) {
  return (
    String(item?.status ?? "")
      .trim()
      .toLowerCase() === "applied"
  );
}
