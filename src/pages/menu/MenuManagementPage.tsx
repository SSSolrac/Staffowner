import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Image, StatusChip } from '@/components/ui';
import { useMenuItems } from '@/hooks/useMenuItems';
import type { MenuItem } from '@/types/menuItem';
import { formatCurrency } from '@/utils/currency';

const defaultDraft: MenuItem = {
  id: '',
  name: '',
  categoryId: '',
  description: '',
  price: 0,
  isAvailable: true,
  imageUrl: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MenuManagementPage = () => {
  const { items, loading, error, saveItem, deleteItem } = useMenuItems();
  const [draft, setDraft] = useState<MenuItem>(defaultDraft);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = useMemo(() => ['All', ...Array.from(new Set(items.map((item) => item.categoryId || 'uncategorized')))], [items]);

  const filtered = useMemo(() => items.filter((item) => {
    const byQuery = item.name.toLowerCase().includes(query.toLowerCase());
    const byCategory = categoryFilter === 'All' || (item.categoryId || 'uncategorized') === categoryFilter;
    return byQuery && byCategory;
  }), [items, query, categoryFilter]);

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <section className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-3">
        <h2 className="text-lg font-semibold">Regular Menu Management</h2>
        <p className="text-sm text-[#6B7280]">Manage permanent menu items, pricing, and availability.</p>

        <div className="grid md:grid-cols-2 gap-3">
          <label className="text-sm">Item Name<input className="block border rounded mt-1 px-2 py-1 w-full" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
          <label className="text-sm">Category ID<input className="block border rounded mt-1 px-2 py-1 w-full" value={draft.categoryId ?? ''} onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })} /></label>
          <label className="text-sm">Price<input type="number" min={0} step="0.01" className="block border rounded mt-1 px-2 py-1 w-full" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} /></label>
          <label className="text-sm">Image URL<input className="block border rounded mt-1 px-2 py-1 w-full" value={draft.imageUrl ?? ''} onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })} /></label>
          <label className="text-sm md:col-span-2">Description<input className="block border rounded mt-1 px-2 py-1 w-full" value={draft.description ?? ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
        </div>

        <div className="flex flex-wrap gap-3 text-sm"><label><input type="checkbox" checked={draft.isAvailable} onChange={(e) => setDraft({ ...draft, isAvailable: e.target.checked })} /> Available</label></div>

        <div className="flex gap-2">
          <button className="border rounded px-3 py-1" onClick={async () => {
            if (!draft.name.trim()) return toast.error('Item name is required.');
            if (draft.price <= 0) return toast.error('Price must be greater than 0.');
            await saveItem({ ...draft, updatedAt: new Date().toISOString(), createdAt: draft.createdAt || new Date().toISOString() });
            setDraft(defaultDraft);
            toast.success('Menu item saved.');
          }}>{draft.id ? 'Update Item' : 'Add Item'}</button>
          {draft.id && <button className="border rounded px-3 py-1" onClick={() => setDraft(defaultDraft)}>Cancel edit</button>}
        </div>
      </section>

      <section className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-4">
        <div className="flex flex-wrap gap-3 items-end justify-between">
          <h3 className="font-medium">Menu Items</h3>
          <div className="flex flex-wrap gap-2">
            <input className="border rounded px-2 py-1 text-sm" placeholder="Search item" value={query} onChange={(e) => setQuery(e.target.value)} />
            <select className="border rounded px-2 py-1 text-sm" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select>
          </div>
        </div>

        {filtered.length === 0 ? <div className="border rounded p-4 text-sm text-[#6B7280]">No menu items match the current filters.</div> : (
          <div className="space-y-2">
            {filtered.map((item) => (
              <div key={item.id} className="border rounded p-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <Image src={item.imageUrl ?? undefined} alt={item.name} className="h-14 w-14 rounded object-cover" />
                  <div>
                    <p className="font-medium">{item.name} · {formatCurrency(item.price)}</p>
                    <p className="text-[#6B7280]">Category: {item.categoryId || 'uncategorized'}</p>
                    <div className="flex gap-2 mt-1">
                      <StatusChip label={item.isAvailable ? 'Available' : 'Unavailable'} tone={item.isAvailable ? 'success' : 'warning'} />
                    </div>
                  </div>
                </div>
                <div className="space-x-2">
                  <button className="border rounded px-2 py-1" onClick={() => setDraft(item)}>Edit</button>
                  <button className="border rounded px-2 py-1" onClick={async () => { await deleteItem(item.id); toast.info('Menu item removed.'); }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
