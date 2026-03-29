import type { DateRangePreset } from './dashboard';

export type PaymentStatus = 'pending' | 'paid';
export type PaymentMethod = 'cash' | 'card' | 'e-wallet';

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'out-for-delivery'
  | 'delivered';

export type OrderItem = {
  name: string;
  qty: number;
  unitPrice: number;
};

export type OrderStatusHistoryItem = {
  status: OrderStatus;
  at: string;
  note?: string;
};

export type Order = {
  id: string;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  serviceFee?: number;
  discount?: number;
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentProofUrl?: string;
  createdAt: string;
  notes?: string;
  loyaltyStampPreparedAt?: string;
};

export type OrderFilters = {
  query?: string;
  status?: OrderStatus | 'all';
  range?: DateRangePreset;
};

export type LoyaltyStampState = 'not-eligible' | 'eligible' | 'granted' | 'already-stamped';
