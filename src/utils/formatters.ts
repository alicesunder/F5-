const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export function formatThaiDate(dateString?: string, short = false): string {
  if (!dateString) return '-';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const yearCE = parseInt(parts[0], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const yearBE = yearCE + 543;
      const monthName = short ? THAI_MONTHS_SHORT[monthIdx] : THAI_MONTHS_FULL[monthIdx];
      return `${day} ${monthName} ${yearBE}`;
    }
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = d.getDate();
    const monthIdx = d.getMonth();
    const yearBE = d.getFullYear() + 543;
    const monthName = short ? THAI_MONTHS_SHORT[monthIdx] : THAI_MONTHS_FULL[monthIdx];
    return `${day} ${monthName} ${yearBE}`;
  } catch {
    return dateString;
  }
}

export function formatThaiDateTime(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const datePart = formatThaiDate(d.toISOString().slice(0, 10));
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${datePart} ${hours}:${minutes} น.`;
  } catch {
    return dateString;
  }
}

export function formatCurrency(amount: number, showSymbol = true): string {
  if (isNaN(amount)) return '0';
  const formatted = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return showSymbol ? `฿ ${formatted}` : formatted;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('th-TH').format(num);
}

export function formatPercent(num: number, decimals = 1): string {
  if (isNaN(num)) return '0.0%';
  return `${num.toFixed(decimals)}%`;
}
