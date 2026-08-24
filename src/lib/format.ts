/** Indian-numbering currency formatting, e.g. ₹1,23,456.78 */
export function formatINR(value: number, fractionDigits = 2): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  return `${sign}₹${abs.toLocaleString("en-IN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

/** Signed variant used for gain/loss figures. */
export function formatSignedINR(value: number, fractionDigits = 2): string {
  const prefix = value > 0 ? "+" : "";
  return prefix + formatINR(value, fractionDigits);
}

export function formatAmount(value: number): string {
  return value.toLocaleString("en-IN", { maximumFractionDigits: 6 });
}
