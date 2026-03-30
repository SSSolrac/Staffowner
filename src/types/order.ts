import type { DateRangePreset } from './dashboard';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'e_wallet';

export type OrderType = 'dine_in' | 'pickup' | 'takeout' | 'delivery';

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type OrderItem = {
  id: string;
  orderId: string;
  menuItemId?: string | null;
  itemName: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderStatusHistory = {
  id: string;
  orderId: string;
  status: OrderStatus;
  note?: string | null;
  changedByUserId?: string | null;
  changedAt: string;
};

export type OrderLoyaltyStatus = 'not-eligible' | 'eligible' | 'stamp-awarded' | 'already-stamped';

export type Order = {
  id: string;
  orderNumber: string;
  customerId?: string | null;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  orderType: OrderType;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  statusTimeline?: OrderStatusHistory[];
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  receiptImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  notes?: string | null;
  loyaltyStampStatus?: OrderLoyaltyStatus;
  loyaltyStampedAt?: string;
  loyaltyStampedBy?: 'automatic-order-confirmation' | 'manual-staff-adjustment';
  loyaltyMessage?: string;
  loyaltyUnlockedRewards?: string[];
};

export type OrderFilters = {
  query?: string;
  status?: OrderStatus | 'all';
  range?: DateRangePreset;
};

export type LoyaltyStampState = 'not-eligible' | 'eligible' | 'granted' | 'already-stamped';
