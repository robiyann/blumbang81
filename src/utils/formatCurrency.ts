// src/utils/formatCurrency.ts

/**
 * Format a number as Indonesian Rupiah currency.
 * @example formatRupiah(30800000) → "Rp 30.800.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number with thousand separators.
 * @example formatNumber(30800000) → "30.800.000"
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

/**
 * Format a number into a readable compact Indonesian currency format.
 * @example formatCompactRupiah(30800000) → "Rp 30 Juta 800rb"
 * @example formatCompactRupiah(9000000) → "Rp 9 Juta"
 * @example formatCompactRupiah(800000) → "Rp 800 Ribu"
 */
export function formatCompactRupiah(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  let formatted = "";
  if (absAmount >= 1000000) {
    const millions = absAmount / 1000000;
    const wholeMillions = Math.floor(millions);
    const restThousands = Math.round((absAmount % 1000000) / 1000);
    
    if (restThousands > 0) {
      formatted = `Rp ${wholeMillions} Juta ${restThousands}rb`;
    } else {
      formatted = `Rp ${wholeMillions} Juta`;
    }
  } else if (absAmount >= 1000) {
    const thousands = Math.round(absAmount / 1000);
    formatted = `Rp ${thousands} Ribu`;
  } else {
    formatted = `Rp ${absAmount}`;
  }

  return isNegative ? `-${formatted}` : formatted;
}
