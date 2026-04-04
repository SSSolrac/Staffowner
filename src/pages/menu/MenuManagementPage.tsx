import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Image, StatusChip } from '@/components/ui';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useIngredients } from '@/hooks/useIngredients';
import { ingredientService } from '@/services/ingredientService';
import type { Ingredient, RecipeLine } from '@/types/ingredient';
import type { MenuItem } from '@/types/menuItem';
import { formatCurrency } from '@/utils/currency';

const defaultDraft: MenuItem = {
  id: '', code: '', name: '', categoryId: '', description: '', price: 0, isAvailable: true, manualAvailabilityOverride: undefined, imageUrl: '', discount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
};

const ingredientDraft: Ingredient = { id: '', code: '', name: '', unit: 'pcs', stockOnHand: 0, reorderLevel: 0, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

export const MenuManagementPage = () => {
  const { items, loading, error, saveItem, deleteItem } = useMenuItems();
  const { ingredients, saveIngredient, deleteIngredient } = useIngredients();
  const [draft, setDraft] = useState<MenuItem>(defaultDraft);
  const [ingDraft, setIngDraft] = useState<Ingredient>(ingredientDraft);
  const [recipeDraft, setRecipeDraft] = useState<RecipeLine>({ id: '', menuItemId: '', ingredientId: '', quantityRequired: 1 });
  const [recipeLines, setRecipeLines] = useState<RecipeLine[]>([]);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => items.filter((item) => `${item.code} ${item.name}`.toLowerCase().includes(query.toLowerCase())), [items, query]);

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <section className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-3">
        <h2 className="text-lg font-semibold">Menu + Ingredient Inventory + Discounts</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <label className="text-sm">Item Name<input className="block border rounded mt-1 px-2 py-1 w-full" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
          <label className="text-sm">Category ID<input className="block border rounded mt-1 px-2 py-1 w-full" value={draft.categoryId ?? ''} onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })} /></label>
          <label className="text-sm">Price<input type="number" min={0} step="0.01" className="block border rounded mt-1 px-2 py-1 w-full" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} /></label>
          <label className="text-sm">Discount %<input type="number" min={0} max={100} className="block border rounded mt-1 px-2 py-1 w-full" value={draft.discount} onChange={(e) => setDraft({ ...draft, discount: Number(e.target.value) })} /></label>
          <label className="text-sm md:col-span-2">Description<input className="block border rounded mt-1 px-2 py-1 w-full" value={draft.description ?? ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
        </div>
        <div className="flex gap-2">
          <button className="border rounded px-3 py-1" onClick={async () => { const saved = await saveItem({ ...draft, updatedAt: new Date().toISOString(), createdAt: draft.createdAt || new Date().toISOString() }); setDraft(defaultDraft); toast.success(`Menu item saved (${saved.code}).`); }}>{draft.id ? 'Update Item' : 'Add Item'}</button>
          {draft.id && <button className="border rounded px-3 py-1" onClick={() => setDraft(defaultDraft)}>Cancel edit</button>}
        </div>
      </section>

      <section className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-4">
        <div className="flex items-center justify-between"><h3 className="font-medium">Menu Items</h3><input className="border rounded px-2 py-1 text-sm" placeholder="Search code or name" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
        <div className="space-y-2">
          {filtered.map((item) => (
            <div key={item.id} className="border rounded p-3 flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-3 min-w-[260px]"><Image src={item.imageUrl ?? undefined} alt={item.name} className="h-14 w-14 rounded object-cover" /><div><p className="font-medium">{item.code} · {item.name} · {formatCurrency(item.price)}</p><p className="text-[#6B7280]">Category: {item.categoryId || 'uncategorized'} · Updated: {new Date(item.updatedAt).toLocaleString()}</p><div className="flex gap-2 mt-1 flex-wrap"><StatusChip label={item.isAvailable ? 'Available' : 'Unavailable'} tone={item.isAvailable ? 'success' : 'warning'} /><StatusChip label={item.discount > 0 ? `${item.discount}% OFF` : 'No discount'} tone={item.discount > 0 ? 'warning' : 'neutral'} /></div></div></div>
              <div className="flex flex-wrap gap-2 items-center"><button className="border rounded px-2 py-1" onClick={() => setDraft(item)}>Edit</button><button className="border rounded px-2 py-1" onClick={async () => { await deleteItem(item.id); toast.info('Menu item removed.'); }}>Delete</button></div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-3">
        <h3 className="font-medium">Ingredients (first-class inventory)</h3>
        <div className="grid md:grid-cols-4 gap-2">
          <input className="border rounded px-2 py-1" placeholder="Ingredient name" value={ingDraft.name} onChange={(e) => setIngDraft({ ...ingDraft, name: e.target.value })} />
          <select className="border rounded px-2 py-1" value={ingDraft.unit} onChange={(e) => setIngDraft({ ...ingDraft, unit: e.target.value as Ingredient['unit'] })}><option value="g">g</option><option value="kg">kg</option><option value="ml">ml</option><option value="l">l</option><option value="pcs">pcs</option></select>
          <input className="border rounded px-2 py-1" type="number" placeholder="Stock" value={ingDraft.stockOnHand} onChange={(e) => setIngDraft({ ...ingDraft, stockOnHand: Number(e.target.value) })} />
          <input className="border rounded px-2 py-1" type="number" placeholder="Reorder level" value={ingDraft.reorderLevel} onChange={(e) => setIngDraft({ ...ingDraft, reorderLevel: Number(e.target.value) })} />
        </div>
        <button className="border rounded px-3 py-1" onClick={async () => { const saved = await saveIngredient(ingDraft); setIngDraft(ingredientDraft); toast.success(`Ingredient saved (${saved.code}).`); }}>Save Ingredient</button>
        <div className="space-y-2">{ingredients.map((ingredient) => <div key={ingredient.id} className="border rounded p-2 text-sm flex items-center justify-between"><p>{ingredient.code} · {ingredient.name} ({ingredient.unit}) — on hand {ingredient.stockOnHand}, reorder {ingredient.reorderLevel}</p><button className="border rounded px-2 py-1" onClick={() => deleteIngredient(ingredient.id)}>Delete</button></div>)}</div>
      </section>

      <section className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-3">
        <h3 className="font-medium">Recipe lines (menu item → ingredient usage)</h3>
        <div className="grid md:grid-cols-3 gap-2">
          <select className="border rounded px-2 py-1" value={recipeDraft.menuItemId} onChange={(e) => setRecipeDraft({ ...recipeDraft, menuItemId: e.target.value })}><option value="">Menu item</option>{items.map((item) => <option key={item.id} value={item.id}>{item.code} · {item.name}</option>)}</select>
          <select className="border rounded px-2 py-1" value={recipeDraft.ingredientId} onChange={(e) => setRecipeDraft({ ...recipeDraft, ingredientId: e.target.value })}><option value="">Ingredient</option>{ingredients.map((ingredient) => <option key={ingredient.id} value={ingredient.id}>{ingredient.code} · {ingredient.name}</option>)}</select>
          <input className="border rounded px-2 py-1" type="number" min={0.001} step="0.001" value={recipeDraft.quantityRequired} onChange={(e) => setRecipeDraft({ ...recipeDraft, quantityRequired: Number(e.target.value) })} />
        </div>
        <button className="border rounded px-3 py-1" onClick={async () => { const saved = await ingredientService.saveRecipeLine(recipeDraft); setRecipeLines((rows) => [saved, ...rows]); toast.success('Recipe line saved. Item availability now derives from ingredient sufficiency + manual override.'); }}>Save Recipe Line</button>
        <div className="space-y-2">{recipeLines.map((line) => <p key={line.id} className="text-sm border rounded p-2">{line.menuItemId} uses {line.ingredientId} qty {line.quantityRequired}</p>)}</div>
      </section>
    </div>
  );
};
