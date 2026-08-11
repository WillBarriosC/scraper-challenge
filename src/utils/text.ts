export function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function toFileName(parts: string[]): string {
  return parts
    .map((part) =>
      part
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "_")
        .toLowerCase()
    )
    .filter(Boolean)
    .join("__");
}