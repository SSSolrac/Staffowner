import { loyaltyService } from '@/services/loyaltyService';
import type { DateRangePreset } from '@/types/dashboard';
import type { Order, OrderFilters, OrderStatus } from '@/types/order';

const buildTotal = (items: Order['items'], serviceFee = 0, discount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  return Number((subtotal + serviceFee - discount).toFixed(2));
};

let ordersSeed: Order[] = [
  {
    id: 'ORD-2101',
    customerId: 'c1',
    customerName: 'Avery Johnson',
    customerEmail: 'avery@example.com',
    customerPhone: '+63 917 555 0101',
    items: [{ name: 'Chicken Alfredo', qty: 1, unitPrice: 245 }, { name: 'Iced Latte', qty: 1, unitPrice: 150 }],
    serviceFee: 20,
    discount: 0,
    total: 415,
    status: 'pending',
    statusHistory: [{ status: 'pending', at: new Date(Date.now() - 1000 * 60 * 35).toISOString(), note: 'Order created' }],
    paymentStatus: 'pending',
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'ORD-2100',
    customerId: 'c2',
    customerName: 'Nora Lin',
    customerEmail: 'nora@example.com',
    customerPhone: '+63 917 555 0102',
    items: [{ name: 'Beef Rice Bowl', qty: 1, unitPrice: 220 }],
    serviceFee: 0,
    discount: 10,
    total: 210,
    status: 'preparing',
    statusHistory: [
      { status: 'pending', at: new Date(Date.now() - 1000 * 60 * 80).toISOString() },
      { status: 'preparing', at: new Date(Date.now() - 1000 * 60 * 70).toISOString(), note: 'Kitchen accepted order' },
    ],
    paymentStatus: 'paid',
    paymentMethod: 'e-wallet',
    paymentProofUrl: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
  },
  {
    id: 'ORD-2099',
    customerName: 'Walk-in Guest',
    items: [{ name: 'Truffle Fries', qty: 1, unitPrice: 130 }, { name: 'Soda', qty: 1, unitPrice: 65 }],
    serviceFee: 0,
    discount: 0,
    total: 195,
    status: 'ready',
    statusHistory: [
      { status: 'pending', at: new Date(Date.now() - 1000 * 60 * 125).toISOString() },
      { status: 'preparing', at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
      { status: 'ready', at: new Date(Date.now() - 1000 * 60 * 115).toISOString() },
    ],
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    createdAt: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
  },
  {
    id: 'ORD-2098',
    customerId: 'c4',
    customerName: 'Mia Turner',
    customerEmail: 'mia@example.com',
    items: [{ name: 'Cafe Club Sandwich', qty: 1, unitPrice: 180 }],
    serviceFee: 0,
    discount: 0,
    total: 180,
    status: 'completed',
    statusHistory: [
      { status: 'pending', at: new Date(Date.now() - 1000 * 60 * 60 * 8.5).toISOString() },
      { status: 'preparing', at: new Date(Date.now() - 1000 * 60 * 60 * 8.3).toISOString() },
      { status: 'ready', at: new Date(Date.now() - 1000 * 60 * 60 * 8.1).toISOString() },
      { status: 'completed', at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
    ],
    paymentStatus: 'paid',
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 'ORD-2097',
    customerId: 'c5',
    customerName: 'Carlos Vega',
    customerEmail: 'carlos@example.com',
    customerPhone: '+63 917 555 0105',
    items: [{ name: 'Pesto Penne', qty: 1, unitPrice: 210 }],
    serviceFee: 0,
    discount: 0,
    total: 210,
    status: 'cancelled',
    statusHistory: [
      { status: 'pending', at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
      { status: 'cancelled', at: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), note: 'Customer cancelled before preparation.' },
    ],
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    notes: 'Customer cancelled before preparation.',
  },
];

const latency = async <T>(value: T): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, 220));
  return value;
};

const rangeToDays: Record<DateRangePreset, number> = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365, ALL: 3650 };

const byRange = (rows: Order[], range: DateRangePreset) => {
  if (range === 'ALL') return rows;
  const cutoff = Date.now() - rangeToDays[range] * 24 * 60 * 60 * 1000;
  return rows.filter((row) => new Date(row.createdAt).getTime() >= cutoff);
};

const seedStamped = ordersSeed.find((order) => order.id === 'ORD-2100');
if (seedStamped) {
  const result = loyaltyService.grantStampForConfirmedOrder(seedStamped);
  ordersSeed = ordersSeed.map((order) => (order.id === seedStamped.id
    ? {
      ...order,
      loyaltyStampPreparedAt: result.stampedAt,
      loyaltyStampStatus: result.granted ? 'stamp-awarded' : 'already-stamped',
      loyaltyStampedAt: result.stampedAt,
      loyaltyStampedBy: result.activity?.source,
      loyaltyMessage: result.reason ?? (result.granted ? 'Stamp awarded from confirmed payment.' : 'Loyalty already applied.'),
      loyaltyUnlockedRewards: result.unlockedRewards?.map((reward) => reward.reward) ?? [],
    }
    : order));
}

export const orderService = {
  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    const range = filters?.range ?? '1M';
    let rows = byRange(ordersSeed, range);

    if (filters?.status && filters.status !== 'all') rows = rows.filter((row) => row.status === filters.status);

    if (filters?.query) {
      const query = filters.query.toLowerCase();
      rows = rows.filter((row) => row.id.toLowerCase().includes(query) || row.customerName.toLowerCase().includes(query));
    }

    return latency(rows.map((row) => ({ ...row, items: [...row.items], statusHistory: [...row.statusHistory] })));
  },

  async confirmPayment(orderId: string): Promise<Order> {
    const current = ordersSeed.find((order) => order.id === orderId);
    if (!current) throw new Error('Order not found');

    const paidOrder = current.paymentStatus === 'paid' ? current : { ...current, paymentStatus: 'paid' as const };
    const stamp = loyaltyService.grantStampForConfirmedOrder(paidOrder);

    const updated: Order = {
      ...paidOrder,
      loyaltyStampPreparedAt: stamp.stampedAt ?? paidOrder.loyaltyStampPreparedAt,
      loyaltyStampStatus: stamp.granted ? 'stamp-awarded' : (stamp.reason === 'Order has already been stamped.' ? 'already-stamped' : 'not-eligible'),
      loyaltyStampedAt: stamp.stampedAt ?? paidOrder.loyaltyStampedAt,
      loyaltyStampedBy: stamp.activity?.source ?? paidOrder.loyaltyStampedBy,
      loyaltyMessage: stamp.reason ?? (stamp.granted ? 'Stamp awarded from confirmed payment.' : paidOrder.loyaltyMessage),
      loyaltyUnlockedRewards: stamp.unlockedRewards?.map((reward) => reward.reward) ?? paidOrder.loyaltyUnlockedRewards,
    };

    ordersSeed = ordersSeed.map((order) => (order.id === orderId ? updated : order));

    return latency({ ...updated, items: [...updated.items], statusHistory: [...updated.statusHistory] });
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const current = ordersSeed.find((order) => order.id === orderId);
    if (!current) throw new Error('Order not found');

    const updated = {
      ...current,
      status,
      statusHistory: [...current.statusHistory, { status, at: new Date().toISOString(), note: 'Updated by staff' }],
    };
    ordersSeed = ordersSeed.map((order) => (order.id === orderId ? updated : order));

    return latency({ ...updated, items: [...updated.items], statusHistory: [...updated.statusHistory] });
  },

  async updateOrderNotes(orderId: string, notes: string): Promise<Order> {
    const current = ordersSeed.find((order) => order.id === orderId);
    if (!current) throw new Error('Order not found');

    const updated = { ...current, notes };
    ordersSeed = ordersSeed.map((order) => (order.id === orderId ? updated : order));

    return latency({ ...updated, items: [...updated.items], statusHistory: [...updated.statusHistory] });
  },

  buildTotal,
};
