import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { KPICard } from '@/components/dashboard/KPICard';
import { TierBadge } from '@/components/ui';
import { useCustomers } from '@/hooks/useCustomers';
import { useDashboardData } from '@/hooks/useDashboardData';

const chartColors = ['#C7798E', '#2E6960', '#FF4F8B', '#22C55E'];

export const DashboardPage = () => {
  const { data, loading, error } = useDashboardData();
  const { customers } = useCustomers();

  if (loading) return <p>Loading dashboard...</p>;
  if (error || !data) return <p className="text-red-600">{error || 'Error'}</p>;

  const exportReport = () => {
    const headers = ['Tier', 'Total members'];
    const rows = data.tierSummary.map((item) => [item.tier, String(item.total)]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-tier-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <button className="rounded border px-3 py-2 text-sm" onClick={exportReport}>Export report</button>
      </div>

      <section className="grid md:grid-cols-4 gap-3">
        {data.kpis.map((item) => <KPICard key={item.label} title={item.label} value={item.value} subtitle={item.helpText} />)}
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-white dark:bg-slate-800 p-4 h-72">
          <h3 className="font-medium mb-3">Members by tier (Pie)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie dataKey="total" data={data.tierSummary} nameKey="tier" outerRadius={92} label>
                {data.tierSummary.map((entry, index) => <Cell key={entry.tier} fill={chartColors[index % chartColors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-white dark:bg-slate-800 p-4 h-72">
          <h3 className="font-medium mb-3">Tier totals (Bar)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data.tierSummary}>
              <XAxis dataKey="tier" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#2E6960" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid md:grid-cols-4 gap-3">
        {data.tierSummary.map((item) => <KPICard key={item.tier} title={`${item.tier} customers`} value={String(item.total)} subtitle="Tier analytics" />)}
      </section>

      <section className="rounded-lg border bg-white dark:bg-slate-800 p-4">
        <h3 className="font-medium mb-3">Customer tiers</h3>
        <table className="w-full text-sm">
          <thead><tr className="text-left"><th>Name</th><th>Email</th><th>Points</th><th>Tier</th></tr></thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t">
                <td>{customer.name}</td><td>{customer.email}</td><td>{customer.points}</td><td><TierBadge tier={customer.tier} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};
