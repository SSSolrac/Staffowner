import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { KPICard } from '@/components/dashboard';
import { TierBadge } from '@/components/ui';
import { useCustomers } from '@/hooks/useCustomers';
import type { Customer, CustomerTier } from '@/types/customer';

const tiers: Array<CustomerTier | 'All'> = ['All', 'Gold', 'Silver', 'Bronze', 'Unranked'];

export const CustomersLoyaltyPage = () => {
  const { customers, loading } = useCustomers();
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState<CustomerTier | 'All'>('All');
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = useMemo(() => customers.filter((customer) => {
    const byQuery = customer.name.toLowerCase().includes(query.toLowerCase()) || customer.email.toLowerCase().includes(query.toLowerCase());
    const byTier = tier === 'All' || customer.tier === tier;
    return byQuery && byTier;
  }), [customers, query, tier]);

  const tierSummary = useMemo(() => ([
    { tier: 'Gold', total: customers.filter((c) => c.tier === 'Gold').length },
    { tier: 'Silver', total: customers.filter((c) => c.tier === 'Silver').length },
    { tier: 'Bronze', total: customers.filter((c) => c.tier === 'Bronze').length },
    { tier: 'Unranked', total: customers.filter((c) => c.tier === 'Unranked').length },
  ]), [customers]);

  if (loading) return <p>Loading customers...</p>;

  return (
    <div className="space-y-4">
      <section className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-3">
        <h2 className="text-lg font-semibold">Customers & Loyalty</h2>
        <p className="text-sm text-slate-500">Review customer segments, loyalty health, and member engagement.</p>
        <div className="flex flex-wrap gap-2">
          <input className="border rounded px-2 py-1 w-full md:w-80" placeholder="Search customer name or email" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="border rounded px-2 py-1" value={tier} onChange={(e) => setTier(e.target.value as CustomerTier | 'All')}>
            {tiers.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section className="grid md:grid-cols-4 gap-3">{tierSummary.map((item) => <KPICard key={item.tier} title={`${item.tier} customers`} value={String(item.total)} subtitle="Tier summary" />)}</section>

      <section className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg border bg-white dark:bg-slate-800 p-4 overflow-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead><tr className="text-left"><th>Name</th><th>Email</th><th>Points</th><th>Tier</th><th>Rewards Redeemed</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id} className="border-t">
                  <td>{customer.name}</td><td>{customer.email}</td><td>{customer.points}</td><td><TierBadge tier={customer.tier} /></td><td>{Math.max(1, Math.floor(customer.points / 220))} claimed</td><td><button className="border rounded px-2 py-1" onClick={() => setSelected(customer)}>Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-sm text-slate-500 mt-3">No customers matched your filters.</p>}
        </div>
        <aside className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-3">
          <h3 className="font-medium">Customer activity snapshot</h3>
          <div className="text-sm space-y-2">
            <p>• Repeat visits this week: <strong>{Math.round(customers.length * 1.8)}</strong></p>
            <p>• Loyalty redemptions in period: <strong>{customers.reduce((sum, c) => sum + Math.floor(c.points / 220), 0)}</strong></p>
            <p>• Members close to next tier: <strong>{customers.filter((c) => c.points > 380 && c.points < 500).length}</strong></p>
          </div>
        </aside>
      </section>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-20">
          <div className="w-full max-w-xl rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between"><h3 className="font-semibold">{selected.name}</h3><button className="border rounded px-2 py-1" onClick={() => setSelected(null)}>Close</button></div>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <p>Email: {selected.email}</p><p>Tier: {selected.tier}</p><p>Points: {selected.points}</p><p>Rewards redeemed: {Math.max(1, Math.floor(selected.points / 220))}</p>
            </div>
            <div className="border rounded p-3 text-sm">
              <p className="font-medium">Recent activity</p>
              <p>Last order: {new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toLocaleDateString()}</p>
              <p>Top order category: Beverages</p>
            </div>
            <div className="border rounded p-3 text-sm">
              <p className="font-medium">Manual loyalty adjustment</p>
              <p className="text-slate-500">Manual point updates will be enabled after backend permission and audit logging integration is completed.</p>
              <button className="border rounded px-2 py-1 mt-2" onClick={() => toast.info('Loyalty adjustment is view-only in this build.')}>Request adjustment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
