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