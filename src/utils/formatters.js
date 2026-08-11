export function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;
    const [year, month, day] = parts;
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    if (isNaN(dateObj.getTime())) return dateString;
    
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  } catch (e) {
    return dateString;
  }
}

export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString("en-IN")}`;
}
