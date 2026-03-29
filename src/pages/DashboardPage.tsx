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
  SalesTrendChart,
  TopItemsChart,
} from '@/components/dashboard';
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatCurrency } from '@/utils/currency';
import type { DashboardAlert } from '@/types/dashboard';
import type { DashboardTabKey } from '@/components/dashboard/DashboardTabs';

const alertPriority = (alerts: DashboardAlert[]) => ({
  critical: alerts.filter((a) => a.tone === 'danger'),
  watch: alerts.filter((a) => a.tone === 'warning'),
  info: alerts.filter((a) => a.tone === 'info'),
});

export const DashboardPage = () => {
  const { data, loading, error, selectedRange, setSelectedRange } = useDashboardData();
  const [activeTab, setActiveTab] = useState<DashboardTabKey>('overview');

  const statusCards = useMemo(() => data?.orders.statusSummary ?? [], [data]);
  const ops = useMemo(() => {
    if (!data) return null;
    const unconfirmed = data.orders.recentOrders.filter((row) => row.status === 'pending').length;
    const cancelled = data.orders.statusSummary.find((s) => s.status === 'cancelled')?.total ?? 0;
    const refunded = data.orders.statusSummary.find((s) => s.status === 'refunded')?.total ?? 0;
    return {
      unconfirmed,
      cancelled,
      refunded,
      menuPublished: data.menu.isPublished,
      lowStock: data.overview.alerts.filter((item) => item.title.toLowerCase().includes('stock')).length,
      alertGroups: alertPriority(data.overview.alerts),
    };
  }, [data]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error || !data || !ops) return <p className="text-red-600">{error || 'Error'}</p>;

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Cafe Owner Dashboard</h1>
          <p className="text-sm text-slate-500">Operational overview for daily cafe performance.</p>
        </div>
        <DateRangeFilter value={selectedRange} onChange={setSelectedRange} />
      </header>

      <DashboardTabs value={activeTab} onChange={setActiveTab}>
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <section className="grid md:grid-cols-5 gap-3">
              {data.overview.kpis.map((item) => (
                <KPICard key={item.label} title={item.label} value={item.value} subtitle={item.helpText} />
              ))}
              <KPICard title="Unconfirmed Payments" value={String(ops.unconfirmed)} subtitle="Needs cashier validation" />
            </section>

            <section className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
              <KPICard title="Cancelled" value={String(ops.cancelled)} subtitle="Review cancellation reasons" />
              <KPICard title="Refunded" value={String(ops.refunded)} subtitle="Audit refund approvals" />
              <KPICard title="Menu Publish" value={ops.menuPublished ? 'Live' : 'Draft'} subtitle="Today service readiness" />
              <KPICard title="Low Stock Alerts" value={String(ops.lowStock)} subtitle="Coordinate with inventory" />
              <KPICard title="Critical Alerts" value={String(ops.alertGroups.critical.length)} subtitle="Immediate action" />
            </section>

            <section className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <SalesTrendChart data={data.overview.salesTrend} />
              </div>
              <AlertsPanel alerts={data.overview.alerts} />
            </section>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {statusCards.map((status) => (
                <KPICard key={status.status} title={`${status.status[0].toUpperCase()}${status.status.slice(1)} Orders`} value={String(status.total)} subtitle={`Within ${selectedRange}`} />
              ))}
            </section>
            <section className="grid lg:grid-cols-2 gap-4">
              <OrderStatusChart data={data.orders.statusChart} />
              <RecentOrdersTable title="Order Activity" rows={data.orders.recentOrders} />
            </section>
            <Link className="inline-block border rounded px-3 py-1.5 text-sm" to="/orders">Open full order operations</Link>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-4">
            <section className="grid lg:grid-cols-2 gap-4">
              <DailyMenuPreview menu={data.menu} />
              <TopItemsChart title="Top Menu Items" data={data.menu.topSellingItems.slice(0, 5)} />
            </section>
            <TopItemsChart title="Category Sales" data={data.menu.categorySales} />
            <Link className="inline-block border rounded px-3 py-1.5 text-sm" to="/daily-menu">Manage daily menu publishing</Link>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-4">
            <section className="grid md:grid-cols-3 gap-3">
              {data.customers.summary.map((item) => (
                <KPICard key={item.label} title={item.label} value={item.value} subtitle={item.helpText} />
              ))}
            </section>
            <section className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-3">
              <h3 className="font-medium">Top Customer Activity</h3>
              <div className="space-y-2">
                {data.customers.mostActiveCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between border rounded p-2 text-sm">
                    <span>{customer.name}</span>
                    <span>{customer.orders} orders</span>
                  </div>
                ))}
              </div>
            </section>
            <Link className="inline-block border rounded px-3 py-1.5 text-sm" to="/customers">Open loyalty workspace</Link>
          </div>
        )}

        {activeTab === 'imports' && (
          <div className="space-y-4">
            <section className="grid md:grid-cols-3 gap-3">
              <KPICard title="Last Import Batch" value="March 29" subtitle="Orders + customers" />
              <KPICard title="Rows Accepted" value="1,284" subtitle="After validation checks" />
              <KPICard title="Rows Flagged" value="17" subtitle="Fix before final import" />
            </section>
            <section className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-3">
              <h3 className="font-medium">Reporting Snapshot</h3>
              <p className="text-sm text-slate-500">Current gross sales in view: {formatCurrency(data.overview.salesTrend.reduce((sum, row) => sum + row.sales, 0))}.</p>
              <p className="text-sm text-slate-500">Use Imports & Reports for CSV uploads, validation, and import history.</p>
            </section>
            <Link className="inline-block border rounded px-3 py-1.5 text-sm" to="/imports">Go to imports & reports</Link>
          </div>
        )}
      </DashboardTabs>
    </div>
  );
};
