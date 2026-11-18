/**
 * Utility to export tabular data to UTF-8 CSV with BOM for Thai character compatibility in Excel.
 * Supports both signatures:
 * 1. exportToCSV(data: Record<string, any>[], filename: string)
 * 2. exportToCSV(filename: string, headers: string[], rows: (string | number)[][])
 */
export function exportToCSV(
  arg1: string | Record<string, any>[],
  arg2?: string[] | string,
  arg3?: (string | number)[][]
) {
  const processCell = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  let filename = 'export';
  let headers: string[] = [];
  let rows: (string | number)[][] = [];

  if (Array.isArray(arg1)) {
    // Mode: (data, filename)
    filename = (arg2 as string) || 'export';
    if (arg1.length > 0) {
      headers = Object.keys(arg1[0]);
      rows = arg1.map(item => headers.map(h => item[h]));
    }
  } else {
    // Mode: (filename, headers, rows)
    filename = arg1 || 'export';
    headers = (arg2 as string[]) || [];
    rows = arg3 || [];
  }

  const headerLine = headers.map(processCell).join(',');
  const rowLines = rows.map(r => r.map(processCell).join(','));
  const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printSection(elementId?: string) {
  window.print();
}
