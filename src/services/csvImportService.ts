import type { CsvImportType, CsvValidationResult, SalesImportMergeResult, SalesImportPreview } from '@/types/dashboard';
import { apiClient } from '@/api/client';

const splitCsvLine = (line: string): string[] => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') { inQuotes = !inQuotes; continue; }
    if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
    current += char;
  }
  values.push(current.trim());
  return values;
};

export const csvImportService = {
  async parseCsvFile(file: File): Promise<Record<string, string>[]> {
    const text = await file.text();
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length < 2) return [];
    const headers = splitCsvLine(lines[0]);
    return lines.slice(1).map((line) => {
      const values = splitCsvLine(line);
      return headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = values[index] ?? '';
        return acc;
      }, {});
    });
  },

  validateImportedRows(type: CsvImportType, rows: Record<string, string>[]): CsvValidationResult {
    const requiredColumns: Record<CsvImportType, string[]> = {
      orders: ['order_id', 'customer_name', 'total', 'status'],
      customers: ['customer_id', 'name', 'email'],
      'menu-items': ['item_name', 'category', 'price'],
      sales: ['date', 'sales_total'],
    };
    const required = requiredColumns[type];
    const invalidRows: CsvValidationResult['invalidRows'] = [];
    const validRows: CsvValidationResult['validRows'] = [];
    rows.forEach((row, index) => {
      const missing = required.filter((column) => !row[column]?.trim());
      if (missing.length) return invalidRows.push({ rowNumber: index + 2, reason: `Missing required column values: ${missing.join(', ')}`, row });
      validRows.push(row);
    });
    return { validRows, invalidRows };
  },

  previewSalesImport(rows: Record<string, string>[]): Promise<SalesImportPreview> {
    return apiClient.post('/api/imports/sales/preview', { rows }).then((r) => (r as { data: SalesImportPreview }).data);
  },

  importSales(rows: Record<string, string>[]): Promise<SalesImportMergeResult> {
    return apiClient.post('/api/imports/sales', { rows }).then((r) => (r as { data: SalesImportMergeResult }).data);
  },

  listHistory(): Promise<Array<{ id: string; type: string; totalRows: number; validRows: number; invalidRows: number; importedAt: string }>> {
    return apiClient.get('/api/imports/history').then((r) => (r as { data: Array<{ id: string; type: string; totalRows: number; validRows: number; invalidRows: number; importedAt: string }> }).data);
  },
};
