export function getFullAddress(address: {
  line1: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}) {
  return [
    address.line1,
    address.city,
    address.state,
    address.country,
    address.zipCode,
  ]
    .filter(Boolean)
    .join(", ");
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}