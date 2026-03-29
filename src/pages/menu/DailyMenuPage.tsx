import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useDailyMenu } from '@/hooks/useDailyMenu';
import type { DailyMenu, DailyMenuCategory, DailyMenuItem } from '@/types/dailyMenu';

const makeId = () => Math.random().toString(36).slice(2, 9);
const ensureMenu = (menu: DailyMenu | null): DailyMenu => menu ?? { id: `menu-${makeId()}`, title: 'Menu of the Day', subtitle: '', mode: 'manual', isActive: false, categories: [], updatedAt: new Date().toISOString() };

export const DailyMenuPage = () => {
  const { menu, loading, error, saving, saveDraft, publish, unpublish, clearMenu } = useDailyMenu();
  const [draft, setDraft] = useState<DailyMenu | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const working = draft ?? menu;
  const preview = ensureMenu(working ?? menu);

  useEffect(() => { if (!draft && menu) setDraft(menu); }, [draft, menu]);
  if (loading) return <p>Loading daily menu...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!working) return <p>No daily menu loaded.</p>;

  const updateCategory = (categoryId: string, updater: (category: DailyMenuCategory) => DailyMenuCategory) => setDraft((prev) => {
    const base = ensureMenu(prev ?? menu);
    return { ...base, categories: base.categories.map((category) => (category.id === categoryId ? updater(category) : category)) };
  });

  const updateItem = (categoryId: string, itemId: string, updater: (item: DailyMenuItem) => DailyMenuItem) => updateCategory(categoryId, (category) => ({ ...category, items: category.items.map((item) => (item.id === itemId ? updater(item) : item)) }));

  const validate = (value: DailyMenu) => {
    const errors: Record<string, string> = {};
    const seenCategory = new Set<string>();
    value.categories.forEach((category) => {
      const cName = category.name.trim().toLowerCase();
      if (!cName) errors[`category-${category.id}`] = 'Category name is required.';
      if (cName && seenCategory.has(cName)) errors[`category-${category.id}`] = 'Duplicate category name.';
      seenCategory.add(cName);
      const seenItem = new Set<string>();
      if (category.items.length === 0) errors[`category-items-${category.id}`] = 'Add at least one item.';
      category.items.forEach((item) => {
        const iName = item.name.trim().toLowerCase();
        if (!iName) errors[`item-${item.id}`] = 'Item name is required.';
        if (iName && seenItem.has(iName)) errors[`item-${item.id}`] = 'Duplicate item name in this category.';
        seenItem.add(iName);
      });
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const shiftCategory = (index: number, dir: -1 | 1) => {
    const next = [...working.categories];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setDraft({ ...working, categories: next });
  };

  const canPublish = working.categories.length > 0 && Object.keys(fieldErrors).length === 0;

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <section className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Daily Menu Management</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Prepare, validate, and publish the menu used by today&apos;s operations.</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded ${working.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>{working.isActive ? 'Published' : 'Draft'}</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-sm">Title<input className="block border rounded mt-1 px-2 py-1 w-full" value={working.title} onChange={(e) => setDraft({ ...working, title: e.target.value })} /></label>
          <label className="text-sm">Mode<select className="block border rounded mt-1 px-2 py-1 w-full" value={working.mode} onChange={(e) => setDraft({ ...working, mode: e.target.value as DailyMenu['mode'] })}><option value="manual">Manual current menu</option><option value="date-based">Date-based menu</option></select></label>
          <label className="text-sm sm:col-span-2">Subtitle<input className="block border rounded mt-1 px-2 py-1 w-full" value={working.subtitle} onChange={(e) => setDraft({ ...working, subtitle: e.target.value })} /></label>
          <label className="text-sm sm:col-span-2">Menu Date (optional)<input type="date" className="block border rounded mt-1 px-2 py-1 w-full" value={working.date ?? ''} onChange={(e) => setDraft({ ...working, date: e.target.value || undefined })} /></label>
        </div>

        <div className="rounded border p-3 text-sm">
          <p><strong>Summary:</strong> {working.categories.length} categories · {working.categories.reduce((sum, c) => sum + c.items.length, 0)} items · {working.isActive ? 'Currently live' : 'Not yet published'}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-medium">Categories</h3><button className="border rounded px-2 py-1" onClick={() => setDraft({ ...working, categories: [...working.categories, { id: `cat-${makeId()}`, name: '', items: [{ id: `item-${makeId()}`, name: '' }] }] })}>Add category</button></div>
          {working.categories.length === 0 && <p className="text-sm text-slate-500 border rounded p-3">No categories added yet. Start by adding your first service category (e.g., Pasta, Beverages).</p>}
          {working.categories.map((category, index) => (
            <div key={category.id} className="border rounded p-3 space-y-3">
              <div className="flex items-center gap-2">
                <input className="border rounded px-2 py-1 flex-1" placeholder="Category name" value={category.name} onChange={(e) => updateCategory(category.id, (current) => ({ ...current, name: e.target.value }))} />
                <button className="border rounded px-2 py-1" onClick={() => shiftCategory(index, -1)}>↑</button>
                <button className="border rounded px-2 py-1" onClick={() => shiftCategory(index, 1)}>↓</button>
                <button className="border rounded px-2 py-1" onClick={() => setDraft({ ...working, categories: working.categories.filter((c) => c.id !== category.id) })}>Remove</button>
              </div>
              {fieldErrors[`category-${category.id}`] && <p className="text-xs text-red-600">{fieldErrors[`category-${category.id}`]}</p>}
              <div className="space-y-2">
                {category.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex items-center gap-2"><input className="border rounded px-2 py-1 flex-1" placeholder="Item name" value={item.name} onChange={(e) => updateItem(category.id, item.id, (current) => ({ ...current, name: e.target.value }))} /><button className="border rounded px-2 py-1" onClick={() => updateCategory(category.id, (c) => ({ ...c, items: c.items.filter((x) => x.id !== item.id) }))}>Remove</button></div>
                    {fieldErrors[`item-${item.id}`] && <p className="text-xs text-red-600 mt-1">{fieldErrors[`item-${item.id}`]}</p>}
                  </div>
                ))}
                {fieldErrors[`category-items-${category.id}`] && <p className="text-xs text-red-600">{fieldErrors[`category-items-${category.id}`]}</p>}
                <button className="border rounded px-2 py-1" onClick={() => updateCategory(category.id, (c) => ({ ...c, items: [...c.items, { id: `item-${makeId()}`, name: '' }] }))}>Add item</button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="border rounded px-3 py-1" disabled={saving} onClick={async () => { if (!validate(working)) return toast.error('Please fix the highlighted fields first.'); const saved = await saveDraft(working); setDraft(saved); toast.success('Daily menu draft saved.'); }}>Save Draft</button>
          <button className="border rounded px-3 py-1" disabled={saving || !canPublish} onClick={async () => { if (!validate(working)) return toast.error('Cannot publish while there are validation issues.'); const saved = await publish(working); setDraft(saved); toast.success('Daily menu published.'); }}>Publish Menu</button>
          <button className="border rounded px-3 py-1" disabled={saving} onClick={async () => { const saved = await unpublish(); setDraft(saved); toast.info('Daily menu unpublished.'); }}>Unpublish</button>
          <button className="border rounded px-3 py-1" disabled={saving} onClick={async () => { const saved = await clearMenu(); setDraft(saved); toast.info('Daily menu cleared.'); }}>Clear Menu</button>
        </div>
      </section>

      <section className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-3">
        <h3 className="font-semibold">Owner Preview</h3>
        <div className="border rounded p-3 space-y-1">
          <p className="font-medium">{preview.title || 'Untitled menu'}</p>
          {preview.subtitle && <p className="text-sm text-slate-600 dark:text-slate-300">{preview.subtitle}</p>}
          {preview.date && <p className="text-xs">Date: {preview.date}</p>}
          <p className="text-xs">{preview.isActive ? 'Live for customers' : 'Not currently visible to customers'}</p>
        </div>

        {preview.categories.length === 0 ? <p className="text-sm text-slate-500 border rounded p-3">Your menu preview will appear here once categories and items are added.</p> : (
          <div className="space-y-3">
            {preview.categories.map((category) => (
              <div key={category.id} className="border rounded p-3">
                <p className="font-medium">{category.name || 'Unnamed category'}</p>
                <ul className="list-disc pl-5 text-sm">{category.items.map((item) => <li key={item.id}>{item.name || 'Unnamed item'}</li>)}</ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
