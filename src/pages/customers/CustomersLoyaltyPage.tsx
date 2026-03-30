import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { KPICard } from '@/components/dashboard';
import { TierBadge } from '@/components/ui';
import { useCustomers } from '@/hooks/useCustomers';
import { LOYALTY_MILESTONE_REWARDS, LOYALTY_TOTAL_STAMPS } from '@/types/loyalty';
import type { CustomerWithLoyalty } from '@/types/customer';

type CustomerTier = 'Gold' | 'Silver' | 'Bronze' | 'Unranked';
const tiers: Array<CustomerTier | 'All'> = ['All', 'Gold', 'Silver', 'Bronze', 'Unranked'];

const getTier = (customer: CustomerWithLoyalty): CustomerTier => {
  if (customer.loyalty.totalStampsEarned >= 40) return 'Gold';
  if (customer.loyalty.totalStampsEarned >= 20) return 'Silver';
  if (customer.loyalty.totalStampsEarned >= 8) return 'Bronze';
  return 'Unranked';
};

const nextMilestoneLabel = (customer: CustomerWithLoyalty) => {
  const current = customer.loyalty.currentStampCount;
  const next = Object.keys(LOYALTY_MILESTONE_REWARDS).map(Number).find((stamp) => current < stamp);
  if (!next) return `Card complete at ${LOYALTY_TOTAL_STAMPS}/${LOYALTY_TOTAL_STAMPS}`;
  const remaining = next - current;
  return `${remaining} stamp${remaining === 1 ? '' : 's'} to ${LOYALTY_MILESTONE_REWARDS[next]}`;
};

export const CustomersLoyaltyPage = () => {
  const { customers, loading, grantManualStamp } = useCustomers();
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState<CustomerTier | 'All'>('All');
  const [selected, setSelected] = useState<CustomerWithLoyalty | null>(null);
  const [manualReason, setManualReason] = useState('');
  const [granting, setGranting] = useState(false);

  const filtered = useMemo(() => customers.filter((customer) => {
    const byQuery = customer.fullName.toLowerCase().includes(query.toLowerCase()) || (customer.email ?? '').toLowerCase().includes(query.toLowerCase());
    const byTier = tier === 'All' || getTier(customer) === tier;
    return byQuery && byTier;
  }), [customers, query, tier]);

  const tierSummary = useMemo(() => ([
    { tier: 'Gold', total: customers.filter((c) => getTier(c) === 'Gold').length },
    { tier: 'Silver', total: customers.filter((c) => getTier(c) === 'Silver').length },
    { tier: 'Bronze', total: customers.filter((c) => getTier(c) === 'Bronze').length },
    { tier: 'Unranked', total: customers.filter((c) => getTier(c) === 'Unranked').length },
  ]), [customers]);

  if (loading) return <p>Loading customers...</p>;

  return (
    <div className="space-y-4">
      <section className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-3">
        <h2 className="text-lg font-semibold">Customers & Loyalty</h2>
        <p className="text-sm text-[#6B7280]">10-stamp loyalty card: Free Latte at stamp 6, Free Groom at stamp 10. Staff can manually grant stamps when needed.</p>
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
          <table className="w-full text-sm min-w-[960px]">
            <thead><tr className="text-left"><th>Name</th><th>Email</th><th>Stamps</th><th>Next Reward</th><th>Unlocked Rewards</th><th>Tier</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id} className="border-t">
                  <td>{customer.fullName}</td>
                  <td>{customer.email ?? '—'}</td>
                  <td>{customer.loyalty.currentStampCount}/{LOYALTY_TOTAL_STAMPS}</td>
                  <td>{nextMilestoneLabel(customer)}</td>
                  <td>{customer.loyalty.rewardsUnlocked.length ? customer.loyalty.rewardsUnlocked.join(', ') : 'None yet'}</td>
                  <td><TierBadge tier={getTier(customer)} /></td>
                  <td><button className="border rounded px-2 py-1" onClick={() => { setSelected(customer); setManualReason(''); }}>Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-3">
          <h3 className="font-medium">Customer activity snapshot</h3>
          <div className="text-sm space-y-2">
            <p>• Customers on active card: <strong>{customers.filter((customer) => customer.loyalty.currentStampCount > 0).length}</strong></p>
            <p>• Free Latte unlocked: <strong>{customers.filter((customer) => customer.loyalty.rewardsUnlocked.includes('Free Latte')).length}</strong></p>
            <p>• Free Groom unlocked: <strong>{customers.filter((customer) => customer.loyalty.rewardsUnlocked.includes('Free Groom')).length}</strong></p>
          </div>
        </aside>
      </section>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-20">
          <div className="w-full max-w-xl rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between"><h3 className="font-semibold">{selected.fullName}</h3><button className="border rounded px-2 py-1" onClick={() => setSelected(null)}>Close</button></div>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <p>Email: {selected.email ?? '—'}</p><p>Tier: {getTier(selected)}</p><p>Phone: {selected.phone ?? '—'}</p><p>Stamps: {selected.loyalty.currentStampCount}/{LOYALTY_TOTAL_STAMPS}</p>
            </div>
            <div className="border rounded p-3 text-sm space-y-1">
              <p className="font-medium">Loyalty summary</p>
              <p>Card structure: {LOYALTY_TOTAL_STAMPS} total stamps</p>
              <p>Reward milestones: stamp 6 = Free Latte, stamp 10 = Free Groom</p>
              <p>Next milestone: {nextMilestoneLabel(selected)}</p>
              <p>Unlocked rewards: {selected.loyalty.rewardsUnlocked.length ? selected.loyalty.rewardsUnlocked.join(', ') : 'None yet'}</p>
            </div>
            <div className="border rounded p-3 text-sm space-y-2">
              <p className="font-medium">Manual loyalty adjustment</p>
              <textarea className="border rounded w-full px-2 py-1 text-sm" rows={2} value={manualReason} onChange={(event) => setManualReason(event.target.value)} placeholder="Optional note/reason" />
              <button className="border rounded px-2 py-1 disabled:opacity-50" disabled={granting} onClick={async () => { setGranting(true); try { const updated = await grantManualStamp(selected.id, manualReason); setSelected(updated); setManualReason(''); toast.info('Manual stamp endpoint is not exposed by shared backend; refreshed latest loyalty data instead.'); } finally { setGranting(false); } }}>
                {granting ? 'Giving Stamp...' : 'Give Stamp'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
