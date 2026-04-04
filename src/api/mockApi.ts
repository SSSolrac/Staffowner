import type { CustomerProfile } from '@/types/customer';
import type { DailyMenu } from '@/types/dailyMenu';
import type { DashboardData, DateRangePreset, SalesImportPreview } from '@/types/dashboard';
import type { Ingredient, RecipeLine } from '@/types/ingredient';
import type { LoginHistoryEntry } from '@/types/loginHistory';
import type { LoyaltyAccount } from '@/types/loyalty';
import type { MenuItem } from '@/types/menuItem';
import type { Order, OrderStatus, PaymentStatus } from '@/types/order';
import type { SessionUser, UserRole } from '@/types/user';
import { asRecord } from './response';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type Query = Record<string, string | number | undefined>;

type ImportedSale = {
  id: string;
  date: string;
  total: number;
  status: string;
  paymentMethod: string;
  customerCode?: string;
  itemCode?: string;
  createdAt: string;
};

type ImportHistoryRow = { id: string; type: 'sales'; totalRows: number; validRows: number; invalidRows: number; importedAt: string; };

type Db = {
  menuItems: MenuItem[];
  dailyMenu: DailyMenu;
  orders: Order[];
  customers: CustomerProfile[];
  loyalty: Record<string, LoyaltyAccount>;
  loginHistory: LoginHistoryEntry[];
  profile: CustomerProfile;
  importedSales: ImportedSale[];
  importHistory: ImportHistoryRow[];
  ingredients: Ingredient[];
  recipeLines: RecipeLine[];
};

const now = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
const ok = <T>(data: T) => ({ data });
const err = (message: string) => ({ error: message });
const seq = (prefix: string, n: number) => `${prefix}-${String(n).padStart(5, '0')}`;

let db: Db | null = null;
const getDb = (): Db => {
  if (db) return db;
  const menuItems: MenuItem[] = [
    { id: 'mi-1', code: seq('MI', 1), categoryId: 'coffee', name: 'Latte', description: '', price: 150, isAvailable: true, imageUrl: null, discount: 0, createdAt: now(), updatedAt: now() },
    { id: 'mi-2', code: seq('MI', 2), categoryId: 'tea', name: 'Milk Tea', description: '', price: 110, isAvailable: true, imageUrl: null, discount: 5, createdAt: now(), updatedAt: now() },
  ];
  const customers: CustomerProfile[] = [{ id: 'cus-1', customerCode: seq('HTC', 1), name: 'Mia Santos', email: 'mia@example.com', phone: '', addresses: [], preferences: {}, createdAt: now(), updatedAt: now() }];
  const orders: Order[] = [{ id: 'ord-1', orderNumber: 'ORD-1', customerId: 'cus-1', customerName: 'Mia Santos', orderType: 'pickup', items: [{ id: 'oi-1', orderId: 'ord-1', menuItemId: 'mi-1', itemName: 'Latte', qty: 1, unitPrice: 150, lineTotal: 150 }], subtotal: 150, serviceFee: 0, discount: 0, total: 150, status: 'pending', paymentStatus: 'pending', paymentMethod: 'gcash', createdAt: now(), updatedAt: now(), statusTimeline: [] }];
  const dailyMenu: DailyMenu = { id: 'dm-1', menuDate: today(), isPublished: true, createdAt: now(), updatedAt: now(), items: [{ id: 'dmi-1', menuItemId: 'mi-1', name: 'MI-00001 · Latte', price: 150, categoryId: 'coffee', isAvailable: true }] };
  const loyalty: Record<string, LoyaltyAccount> = { 'cus-1': { customerId: 'cus-1', stampCount: 1, availableRewards: [{ id: 'rw-1', label: 'Free Cookie', requiredStamps: 10 }], redeemedRewards: [], updatedAt: now() } };
  const ingredients: Ingredient[] = [
    { id: 'ing-1', code: seq('ING', 1), name: 'Espresso Beans', unit: 'g', stockOnHand: 600, reorderLevel: 300, isActive: true, createdAt: now(), updatedAt: now() },
    { id: 'ing-2', code: seq('ING', 2), name: 'Milk', unit: 'ml', stockOnHand: 800, reorderLevel: 500, isActive: true, createdAt: now(), updatedAt: now() },
  ];
  const recipeLines: RecipeLine[] = [
    { id: 'rl-1', menuItemId: 'mi-1', ingredientId: 'ing-1', quantityRequired: 18 },
    { id: 'rl-2', menuItemId: 'mi-1', ingredientId: 'ing-2', quantityRequired: 220 },
  ];
  const importedSales: ImportedSale[] = [];
  db = { menuItems, dailyMenu, orders, customers, loyalty, loginHistory: [], profile: customers[0], importedSales, importHistory: [], ingredients, recipeLines };
  return db;
};

const matchesRange = (isoDate: string, range: DateRangePreset): boolean => {
  if (range === 'all') return true;
  const d = new Date(isoDate);
  const end = new Date();
  const start = new Date();
  const days = range === 'today' ? 0 : range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' || range === '3m' ? 90 : range === '6m' ? 180 : 365;
  start.setDate(end.getDate() - days);
  return d >= start && d <= end;
};

const computeAvailability = (menuItemId: string, manual: boolean | undefined, data: Db) => {
  if (manual === false) return false;
  const lines = data.recipeLines.filter((line) => line.menuItemId === menuItemId);
  if (!lines.length) return true;
  return lines.every((line) => {
    const ing = data.ingredients.find((row) => row.id === line.ingredientId);
    return ing && ing.isActive && ing.stockOnHand >= line.quantityRequired;
  });
};

const dashboard = (data: Db, range: DateRangePreset): DashboardData => {
  const rangedOrders = data.orders.filter((o) => matchesRange(o.createdAt, range));
  const rangedImported = data.importedSales.filter((s) => matchesRange(s.date, range));
  const paidOrders = rangedOrders.filter((o) => o.paymentStatus === 'paid');
  const liveSalesTotal = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const importedSalesTotal = rangedImported.reduce((sum, s) => sum + s.total, 0);

  return {
    sales: {
      today: [...paidOrders.filter((o) => o.createdAt.slice(0, 10) === today()).map((o) => o.total), ...rangedImported.filter((s) => s.date.slice(0, 10) === today()).map((s) => s.total)].reduce((sum, n) => sum + n, 0),
      rangeTotal: liveSalesTotal + importedSalesTotal,
      averageOrderValue: rangedOrders.length ? liveSalesTotal / rangedOrders.length : 0,
    },
    orders: {
      today: rangedOrders.filter((o) => o.createdAt.slice(0, 10) === today()).length,
      rangeTotal: rangedOrders.length + rangedImported.length,
      pending: rangedOrders.filter((o) => o.status === 'pending').length,
      preparing: rangedOrders.filter((o) => o.status === 'preparing').length,
      ready: rangedOrders.filter((o) => o.status === 'ready').length,
      outForDelivery: rangedOrders.filter((o) => o.status === 'out_for_delivery').length,
      completed: rangedOrders.filter((o) => o.status === 'completed').length,
      cancelled: rangedOrders.filter((o) => o.status === 'cancelled').length,
    },
    topItems: data.menuItems.slice(0, 5).map((item) => ({ itemName: item.name, quantity: 1, revenue: item.price })),
    recentOrders: rangedOrders,
    alerts: data.ingredients.filter((i) => i.stockOnHand <= i.reorderLevel).map((i) => ({ id: i.id, type: i.stockOnHand === 0 ? 'error' : 'warning', message: `${i.name} (${i.code}) is low stock.` })),
  };
};

const nextCode = (prefix: 'MI' | 'HTC' | 'ING', rows: string[]) => {
  const max = rows.map((code) => Number(code.split('-')[1] ?? 0)).reduce((a, b) => Math.max(a, b), 0);
  return seq(prefix, max + 1);
};

const parseSalesRows = (body: unknown) => {
  const rows = Array.isArray((asRecord(body) ?? {}).rows) ? ((asRecord(body) ?? {}).rows as Array<Record<string, unknown>>) : [];
  const validRows: Record<string, string>[] = [];
  const invalidRows: SalesImportPreview['invalidRows'] = [];
  rows.forEach((raw, idx) => {
    const row = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, String(v ?? '').trim()]));
    const date = row.date;
    const total = Number(row.salesTotal ?? row.sales_total ?? row.total);
    if (!date || Number.isNaN(new Date(date).valueOf())) return invalidRows.push({ rowNumber: idx + 2, reason: 'Invalid date', row });
    if (!Number.isFinite(total) || total < 0) return invalidRows.push({ rowNumber: idx + 2, reason: 'Invalid sales total', row });
    validRows.push({ ...row, date: new Date(date).toISOString(), salesTotal: String(total), paymentMethod: row.paymentMethod || row.payment_method || 'unknown', status: row.status || 'completed' });
  });
  return { validRows, invalidRows };
};

export const mockApi = {
  async request<T>(method: HttpMethod, path: string, query?: Query, body?: unknown): Promise<T> {
    const data = getDb();
    const p = path.startsWith('/') ? path : `/${path}`;

    if (method === 'POST' && p === '/api/auth/login') {
      const b = asRecord(body) ?? {};
      const email = String(b.email ?? '').toLowerCase();
      const role = String(b.role ?? 'staff') as UserRole;
      const valid = (email === 'owner@happytails.com' && role === 'owner') || (email === 'staff@happytails.com' && role === 'staff') || (email === 'customer@happytails.com' && role === 'customer');
      if (!valid) throw new Error('Invalid credentials');
      const user: SessionUser = { id: role === 'owner' ? 'owner-1' : role === 'staff' ? 'staff-1' : 'customer-1', name: `${role[0].toUpperCase()}${role.slice(1)} User`, email, role, token: 'mock-token' };
      return clone(ok(user)) as T;
    }
    if (method === 'POST' && p === '/api/auth/login-history') {
      const b = asRecord(body) ?? {};
      const row: LoginHistoryEntry = { id: `lh-${Math.random().toString(36).slice(2, 8)}`, userId: String(b.userId ?? ''), userName: String(b.userName ?? ''), role: String(b.role ?? 'staff'), loginTime: String(b.loginTime ?? now()), logoutTime: b.logoutTime ? String(b.logoutTime) : null, ipAddress: b.ipAddress ? String(b.ipAddress) : null, device: b.device ? String(b.device) : null, loginStatus: String(b.loginStatus ?? 'success') };
      data.loginHistory.unshift(row);
      return clone(ok(row)) as T;
    }
    if (method === 'GET' && p === '/api/auth/login-history') return clone(ok({ rows: data.loginHistory, total: data.loginHistory.length })) as T;
    if (method === 'GET' && p === '/api/auth/login-history/stats') return clone(ok({ totalToday: data.loginHistory.length, failed: data.loginHistory.filter((r) => r.loginStatus !== 'success').length, staff: data.loginHistory.filter((r) => r.role === 'staff').length, customer: data.loginHistory.filter((r) => r.role === 'customer').length })) as T;

    if (method === 'GET' && p === '/api/dashboard') return clone(ok(dashboard(data, String(query?.range ?? 'today') as DateRangePreset))) as T;

    if (method === 'POST' && p === '/api/imports/sales/preview') {
      const parsed = parseSalesRows(body);
      return clone(ok({ ...parsed, summary: { totalRows: parsed.validRows.length + parsed.invalidRows.length, validCount: parsed.validRows.length, invalidCount: parsed.invalidRows.length } })) as T;
    }
    if (method === 'POST' && p === '/api/imports/sales') {
      const parsed = parseSalesRows(body);
      let added = 0; let updated = 0;
      parsed.validRows.forEach((row) => {
        const existing = data.importedSales.find((s) => s.date.slice(0, 10) === row.date.slice(0, 10) && s.customerCode === row.customerCode);
        if (existing) {
          existing.total = Number(row.salesTotal);
          existing.status = row.status;
          existing.paymentMethod = row.paymentMethod;
          updated += 1;
        } else {
          data.importedSales.push({ id: `is-${Math.random().toString(36).slice(2, 8)}`, date: row.date, total: Number(row.salesTotal), status: row.status, paymentMethod: row.paymentMethod, customerCode: row.customerCode, itemCode: row.itemCode, createdAt: now() });
          added += 1;
        }
      });
      data.importHistory.unshift({ id: `imp-${Math.random().toString(36).slice(2, 8)}`, type: 'sales', totalRows: parsed.validRows.length + parsed.invalidRows.length, validRows: parsed.validRows.length, invalidRows: parsed.invalidRows.length, importedAt: now() });
      const dates = parsed.validRows.map((r) => r.date).sort();
      return clone(ok({ added, updated, skipped: parsed.invalidRows.length, affectedDateRange: dates.length ? { start: dates[0], end: dates[dates.length - 1] } : undefined })) as T;
    }
    if (method === 'GET' && p === '/api/imports/history') return clone(ok(data.importHistory)) as T;

    if (method === 'GET' && p === '/api/orders') return clone(ok(data.orders)) as T;
    const orderMatch = p.match(/^\/api\/orders\/([^/]+)$/);
    if (method === 'GET' && orderMatch) return clone(ok(data.orders.find((o) => o.id === orderMatch[1]))) as T;
    const orderStatus = p.match(/^\/api\/orders\/([^/]+)\/status$/);
    if (method === 'PATCH' && orderStatus) {
      const o = data.orders.find((x) => x.id === orderStatus[1]);
      if (!o) throw new Error('Order not found');
      o.status = String((asRecord(body) ?? {}).status ?? o.status) as OrderStatus;
      o.updatedAt = now();
      return clone(ok(o)) as T;
    }
    const orderPayment = p.match(/^\/api\/orders\/([^/]+)\/payment$/);
    if (method === 'PATCH' && orderPayment) {
      const o = data.orders.find((x) => x.id === orderPayment[1]);
      if (!o) throw new Error('Order not found');
      o.paymentStatus = String((asRecord(body) ?? {}).paymentStatus ?? o.paymentStatus) as PaymentStatus;
      o.updatedAt = now();
      return clone(ok(o)) as T;
    }

    if (method === 'GET' && p === '/api/customers') return clone(ok(data.customers)) as T;
    if (method === 'POST' && p === '/api/customers') {
      const b = asRecord(body) ?? {};
      const customer: CustomerProfile = { id: `cus-${Math.random().toString(36).slice(2, 8)}`, customerCode: nextCode('HTC', data.customers.map((c) => c.customerCode)), name: String(b.name ?? ''), email: String(b.email ?? ''), phone: String(b.phone ?? ''), addresses: [], preferences: {}, createdAt: now(), updatedAt: now() };
      data.customers.unshift(customer);
      return clone(ok(customer)) as T;
    }
    const customerMatch = p.match(/^\/api\/customers\/([^/]+)$/);
    if (method === 'GET' && customerMatch) return clone(ok(data.customers.find((c) => c.id === customerMatch[1]))) as T;

    if (method === 'GET' && p === '/api/profile/me') return clone(ok(data.profile)) as T;
    if (method === 'PUT' && p === '/api/profile/me') {
      data.profile = { ...data.profile, ...(asRecord(body) ?? {}), updatedAt: now() };
      return clone(ok(data.profile)) as T;
    }

    const loyaltyMatch = p.match(/^\/api\/loyalty\/([^/]+)$/);
    if (method === 'GET' && loyaltyMatch) return clone(ok(data.loyalty[loyaltyMatch[1]] ?? { customerId: loyaltyMatch[1], stampCount: 0, availableRewards: [], redeemedRewards: [], updatedAt: now() })) as T;

    if (method === 'GET' && p === '/api/ingredients') return clone(ok(data.ingredients)) as T;
    if (method === 'POST' && p === '/api/ingredients') {
      const b = asRecord(body) ?? {};
      const ingredient: Ingredient = { id: `ing-${Math.random().toString(36).slice(2, 8)}`, code: nextCode('ING', data.ingredients.map((i) => i.code)), name: String(b.name ?? ''), unit: (String(b.unit ?? 'pcs') as Ingredient['unit']), stockOnHand: Number(b.stockOnHand ?? 0), reorderLevel: Number(b.reorderLevel ?? 0), isActive: Boolean(b.isActive ?? true), createdAt: now(), updatedAt: now() };
      data.ingredients.unshift(ingredient);
      return clone(ok(ingredient)) as T;
    }
    const ingredientMatch = p.match(/^\/api\/ingredients\/([^/]+)$/);
    if (ingredientMatch && method === 'PUT') {
      const b = asRecord(body) ?? {};
      const next: Ingredient = { id: ingredientMatch[1], code: String(b.code ?? ''), name: String(b.name ?? ''), unit: String(b.unit ?? 'pcs') as Ingredient['unit'], stockOnHand: Number(b.stockOnHand ?? 0), reorderLevel: Number(b.reorderLevel ?? 0), isActive: Boolean(b.isActive ?? true), createdAt: String(b.createdAt ?? now()), updatedAt: now() };
      data.ingredients = data.ingredients.map((i) => (i.id === next.id ? next : i));
      return clone(ok(next)) as T;
    }
    if (ingredientMatch && method === 'DELETE') {
      data.ingredients = data.ingredients.filter((i) => i.id !== ingredientMatch[1]);
      return undefined as T;
    }

    if (method === 'GET' && p === '/api/recipes') {
      const menuItemId = String(query?.menuItemId ?? '');
      return clone(ok(menuItemId ? data.recipeLines.filter((line) => line.menuItemId === menuItemId) : data.recipeLines)) as T;
    }
    if (method === 'POST' && p === '/api/recipes') {
      const b = asRecord(body) ?? {};
      const line: RecipeLine = { id: `rl-${Math.random().toString(36).slice(2, 8)}`, menuItemId: String(b.menuItemId ?? ''), ingredientId: String(b.ingredientId ?? ''), quantityRequired: Number(b.quantityRequired ?? 0) };
      data.recipeLines.unshift(line);
      data.menuItems = data.menuItems.map((item) => item.id === line.menuItemId ? { ...item, isAvailable: computeAvailability(item.id, item.manualAvailabilityOverride, data), updatedAt: now() } : item);
      return clone(ok(line)) as T;
    }
    const recipeMatch = p.match(/^\/api\/recipes\/([^/]+)$/);
    if (method === 'PUT' && recipeMatch) {
      const b = asRecord(body) ?? {};
      const line: RecipeLine = { id: recipeMatch[1], menuItemId: String(b.menuItemId ?? ''), ingredientId: String(b.ingredientId ?? ''), quantityRequired: Number(b.quantityRequired ?? 0) };
      data.recipeLines = data.recipeLines.map((row) => row.id === line.id ? line : row);
      return clone(ok(line)) as T;
    }
    if (method === 'DELETE' && recipeMatch) {
      data.recipeLines = data.recipeLines.filter((row) => row.id !== recipeMatch[1]);
      return undefined as T;
    }

    if (method === 'GET' && p === '/api/menu') {
      data.menuItems = data.menuItems.map((item) => ({ ...item, isAvailable: computeAvailability(item.id, item.manualAvailabilityOverride, data) }));
      return clone(ok(data.menuItems)) as T;
    }
    if (method === 'POST' && p === '/api/menu') {
      const b = asRecord(body) ?? {};
      const item: MenuItem = { id: `mi-${Math.random().toString(36).slice(2, 8)}`, code: nextCode('MI', data.menuItems.map((m) => m.code)), categoryId: String(b.categoryId ?? ''), name: String(b.name ?? ''), description: String(b.description ?? ''), price: Number(b.price ?? 0), isAvailable: true, manualAvailabilityOverride: b.manualAvailabilityOverride === undefined ? undefined : Boolean(b.manualAvailabilityOverride), imageUrl: b.imageUrl ? String(b.imageUrl) : null, discount: Number(b.discount ?? 0), createdAt: now(), updatedAt: now() };
      item.isAvailable = computeAvailability(item.id, item.manualAvailabilityOverride, data);
      data.menuItems.unshift(item);
      return clone(ok(item)) as T;
    }
    const menuMatch = p.match(/^\/api\/menu\/([^/]+)$/);
    if (method === 'PUT' && menuMatch) {
      const b = asRecord(body) ?? {};
      const item: MenuItem = { id: menuMatch[1], code: String(b.code ?? ''), categoryId: String(b.categoryId ?? ''), name: String(b.name ?? ''), description: String(b.description ?? ''), price: Number(b.price ?? 0), isAvailable: true, manualAvailabilityOverride: b.manualAvailabilityOverride === undefined ? undefined : Boolean(b.manualAvailabilityOverride), imageUrl: b.imageUrl ? String(b.imageUrl) : null, discount: Number(b.discount ?? 0), createdAt: String(b.createdAt ?? now()), updatedAt: now() };
      item.isAvailable = computeAvailability(item.id, item.manualAvailabilityOverride, data);
      data.menuItems = data.menuItems.map((m) => m.id === item.id ? item : m);
      return clone(ok(item)) as T;
    }
    if (method === 'DELETE' && menuMatch) {
      data.menuItems = data.menuItems.filter((m) => m.id !== menuMatch[1]);
      return undefined as T;
    }

    if (method === 'GET' && p === '/api/menu/daily') return clone(ok(data.dailyMenu)) as T;
    if (method === 'PUT' && p === '/api/menu/daily') {
      const b = asRecord(body) ?? {};
      data.dailyMenu = { ...data.dailyMenu, ...b, updatedAt: now() } as DailyMenu;
      return clone(ok(data.dailyMenu)) as T;
    }
    if (method === 'POST' && p === '/api/menu/daily/publish') {
      data.dailyMenu = { ...data.dailyMenu, isPublished: true, updatedAt: now() };
      return clone(ok(data.dailyMenu)) as T;
    }
    if (method === 'POST' && p === '/api/menu/daily/unpublish') {
      data.dailyMenu = { ...data.dailyMenu, isPublished: false, updatedAt: now() };
      return clone(ok(data.dailyMenu)) as T;
    }
    if (method === 'POST' && p === '/api/menu/daily/clear') {
      data.dailyMenu = { ...data.dailyMenu, items: [], isPublished: false, updatedAt: now() };
      return clone(ok(data.dailyMenu)) as T;
    }

    throw new Error(err(`Mock API endpoint not implemented: ${method} ${p}`).error);
  },
};
