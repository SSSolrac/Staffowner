import type { Order } from './order';

export type DateRangePreset = '1M' | '3M' | '6M' | '1Y' | 'ALL';

export type DashboardSummary = {
  salesSummary: {
    todaySales: number;
    weeklySales: number;
    monthlySales: number;
    averageOrderValue: number;
  };
  orderStatusSummary: {
    pending: number;
    preparing: number;
    ready: number;
    out_for_delivery: number;
    completed: number;
    delivered: number;
    cancelled: number;
    refunded: number;
  };
  recentOrders: Order[];
  topSellingItems: Array<{
    itemName: string;
    qtySold: number;
    revenue: number;
  }>;
  customerSummary: {
    totalCustomers: number;
    activeLoyaltyCustomers: number;
  };
};

export type CsvImportType = 'orders' | 'customers' | 'menu-items';

export type CsvValidationResult = {
  validRows: Record<string, string>[];
  invalidRows: Array<{ rowNumber: number; reason: string; row: Record<string, string> }>;
};
