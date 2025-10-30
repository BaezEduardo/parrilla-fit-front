export function formatPrice(n) {
  if (n == null || Number.isNaN(Number(n))) return "";
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

export function capitalize(s = "") {
  return s.length ? s[0].toUpperCase() + s.slice(1) : "";
}
