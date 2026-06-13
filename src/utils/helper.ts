export const capitalizeFirstLetter = (
  value: string
): string => {
  if (!value) return "";

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
};

export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase();

  return (
    parts[0][0].toUpperCase() +
    parts[parts.length - 1][0].toUpperCase()
  );
}
export function mapToLabelValue<T>(
  data: T[],
  labelKey: keyof T,
  valueKey: keyof T
) {
  return data.map((item) => ({
    label: String(item[labelKey]),
    value: String(item[valueKey]),
  }));
}

// ─── Format File Size ────────────────────────────────────────────
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}
