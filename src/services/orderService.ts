import { ordersApi } from '@/api/orders';
import type { DateRangePreset } from '@/types/dashboard';
import type { Order, OrderFilters, OrderStatus } from '@/types/order';

const rangeToDays: Record<DateRangePreset, number> = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365, ALL: 3650 };

const byRange = (rows: Order[], range: DateRangePreset) => {
  if (range === 'ALL') return rows;
  const cutoff = Date.now() - rangeToDays[range] * 24 * 60 * 60 * 1000;
  return rows.filter((row) => new Date(row.createdAt).getTime() >= cutoff);
};

export const orderService = {
  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    const range = filters?.range ?? '1M';
    let rows = await ordersApi.list(filters);

    rows = byRange(rows, range);

    if (filters?.status && filters.status !== 'all') rows = rows.filter((row) => row.status === filters.status);

    if (filters?.query) {
      const query = filters.query.toLowerCase();
      rows = rows.filter((row) => row.orderNumber.toLowerCase().includes(query) || row.customerName.toLowerCase().includes(query));
    }

    return rows;
  },

  async confirmPayment(orderId: string): Promise<Order> {
    const paidOrder = await ordersApi.updatePayment(orderId, 'paid');
    const statusTimeline = await ordersApi.getHistory(orderId);
    return {
      ...paidOrder,
      statusTimeline,
      loyaltyStampStatus: paidOrder.loyaltyStampStatus ?? (paidOrder.customerId ? 'eligible' : 'not-eligible'),
      loyaltyMessage: paidOrder.loyaltyMessage ?? (paidOrder.customerId ? 'Payment confirmed. Loyalty is tracked by backend account data.' : 'No loyalty account linked.'),
    };
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const updated = await ordersApi.updateStatus(orderId, status);
    const statusTimeline = await ordersApi.getHistory(orderId);
    return { ...updated, statusTimeline };
  },
};
