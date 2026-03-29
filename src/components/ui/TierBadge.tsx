import type { CustomerTier } from '@/types/customer';

const colorMap: Record<CustomerTier, string> = {
  Gold: 'bg-yellow-100 text-yellow-800',
  Silver: 'bg-[#FFE4E8] text-slate-700',
  Bronze: 'bg-orange-100 text-orange-800',
  Unranked: 'bg-zinc-100 text-zinc-600',
};

export const TierBadge = ({ tier }: { tier: CustomerTier }) => (
  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colorMap[tier]}`}>{tier}</span>
);
