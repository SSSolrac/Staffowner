import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  AlertsPanel,
  DailyMenuPreview,
  DashboardTabs,
  DateRangeFilter,
  KPICard,
  OrderStatusChart,
  RecentOrdersTable,
  TopItemsChart,
} from '@/components/dashboard';
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatCurrency } from '@/utils/currency';
import type { DashboardTabKey } from '@/components/dashboard/DashboardTabs';

export const DashboardPage = () => {
  const { data, loading, error, selectedRange, setSelectedRange } = useDashboardData();
  const [activeTab, setActiveTab] = useState<DashboardTabKey>('overview');

  const statusCards = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.orderStatusSummary).map(([status, total]) => ({ status, total }));
  }, [data]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error || !data) return <p className="text-red-600">{error || 'Error'}</p>;

  const alerts = [
    { id: 'alert-pending', tone: 'warning' as const, title: 'Pending orders', message: `${data.orderStatusSummary.pending} orders need attention.` },
    { id: 'alert-refund', tone: 'danger' as const, title: 'Refunded orders', message: `${data.orderStatusSummary.refunded} refunded orders recorded.` },
    { id: 'alert-ready', tone: 'info' as const, title: 'Ready for pickup', message: `${data.orderStatusSummary.ready} orders are ready.` },
  ];

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Cafe Owner Dashboard</h1>
          <p className="text-sm text-[#6B7280]">Operational overview for daily cafe performance.</p>
        </div>
        <DateRangeFilter value={selectedRange} onChange={setSelectedRange} />
      </header>

      <DashboardTabs value={activeTab} onChange={setActiveTab}>
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <section className="grid md:grid-cols-5 gap-3">
              <KPICard title="Today Sales" value={formatCurrency(data.salesSummary.todaySales)} subtitle="From dashboard summary" />
              <KPICard title="Weekly Sales" value={formatCurrency(data.salesSummary.weeklySales)} subtitle="From dashboard summary" />
              <KPICard title="Monthly Sales" value={formatCurrency(data.salesSummary.monthlySales)} subtitle="From dashboard summary" />
              <KPICard title="Average Order Value" value={formatCurrency(data.salesSummary.averageOrderValue)} subtitle="From dashboard summary" />
              <KPICard title="Active Loyalty Customers" value={String(data.customerSummary.activeLoyaltyCustomers)} subtitle="From dashboard summary" />
            </section>

            <section className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <TopItemsChart
                  title="Top Selling Items (Qty)"
                  data={data.topSellingItems.map((item) => ({ label: item.itemName, value: item.qtySold }))}
                />
              </div>
              <AlertsPanel alerts={alerts} />
            </section>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {statusCards.map((status) => (
                <KPICard key={status.status} title={`${status.status.replaceAll('_', ' ')} Orders`} value={String(status.total)} subtitle={`Within ${selectedRange}`} />
              ))}
            </section>
            <section className="grid lg:grid-cols-2 gap-4">
              <OrderStatusChart data={statusCards} />
              <RecentOrdersTable title="Order Activity" rows={data.recentOrders} />
            </section>
            <Link className="inline-block border rounded px-3 py-1.5 text-sm" to="/orders">Open full order operations</Link>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-4">
            <section className="grid lg:grid-cols-2 gap-4">
              <DailyMenuPreview menuDate={new Date().toISOString().slice(0, 10)} isPublished items={data.topSellingItems.slice(0, 5).map((item) => item.itemName)} />
              <TopItemsChart title="Top Item Revenue" data={data.topSellingItems.map((item) => ({ label: item.itemName, value: item.revenue }))} />
            </section>
            <Link className="inline-block border rounded px-3 py-1.5 text-sm" to="/daily-menu">Manage daily menu publishing</Link>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-4">
            <section className="grid md:grid-cols-3 gap-3">
              <KPICard title="Total Customers" value={String(data.customerSummary.totalCustomers)} subtitle="From dashboard summary" />
              <KPICard title="Active Loyalty Customers" value={String(data.customerSummary.activeLoyaltyCustomers)} subtitle="From dashboard summary" />
              <KPICard title="Recent Orders" value={String(data.recentOrders.length)} subtitle="From dashboard summary" />
            </section>
            <Link className="inline-block border rounded px-3 py-1.5 text-sm" to="/customers">Open loyalty workspace</Link>
          </div>
        )}

        {activeTab === 'imports' && (
          <div className="space-y-4">
            <section className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-3">
              <h3 className="font-medium">Reporting Snapshot</h3>
              <p className="text-sm text-[#6B7280]">Current monthly sales: {formatCurrency(data.salesSummary.monthlySales)}.</p>
              <p className="text-sm text-[#6B7280]">Use Imports & Reports for CSV uploads, validation, and import history.</p>
            </section>
            <Link className="inline-block border rounded px-3 py-1.5 text-sm" to="/imports">Go to imports & reports</Link>
          </div>
        )}
      </DashboardTabs>
    </div>
  );
};
