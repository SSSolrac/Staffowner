import { supabase } from '@/lib/supabase';
import { asRecord, mapMenuCategoryRow, mapMenuItemRow } from '@/lib/mappers';
import type { MenuCategory, MenuItem } from '@/types/menuItem';

const asDbError = (error: unknown, fallback = 'Database request failed.') => {
  const message = asRecord(error)?.message;
  if (typeof message === 'string' && message.trim()) return new Error(message);
  if (error instanceof Error && error.message.trim()) return new Error(error.message);
  return new Error(fallback);
};

export const menuService = {
  async getMenuCategories(): Promise<MenuCategory[]> {
    const { data, error } = await supabase.from('menu_categories').select('*').order('sort_order', { ascending: true });
    if (error) throw asDbError(error, 'Unable to load menu categories.');
    return (Array.isArray(data) ? data : []).map(mapMenuCategoryRow).filter((row) => row.isActive !== false);
  },

  async saveMenuCategory(category: MenuCategory): Promise<MenuCategory> {
    const payload = {
      name: category.name,
      sort_order: category.sortOrder,
      is_active: category.isActive,
    };

    if (category.id) {
      const { data, error } = await supabase.from('menu_categories').update(payload).eq('id', category.id).select('*').single();
      if (error) throw asDbError(error, 'Unable to save menu category.');
      return mapMenuCategoryRow(data);
    }

    const { data, error } = await supabase.from('menu_categories').insert(payload).select('*').single();
    if (error) throw asDbError(error, 'Unable to create menu category.');
    return mapMenuCategoryRow(data);
  },

  async deleteMenuCategory(categoryId: string): Promise<void> {
    const { error } = await supabase.from('menu_categories').delete().eq('id', categoryId);
    if (error) throw asDbError(error, 'Unable to delete menu category.');
  },

  async getMenuItems(): Promise<MenuItem[]> {
    const view = await supabase.from('menu_item_effective_availability').select('*').order('code', { ascending: true });
    if (!view.error) return (Array.isArray(view.data) ? view.data : []).map(mapMenuItemRow);

    const { data, error } = await supabase.from('menu_items').select('*').order('code', { ascending: true });
    if (error) throw asDbError(error, 'Unable to load menu items.');
    return (Array.isArray(data) ? data : []).map(mapMenuItemRow);
  },

  async saveMenuItem(item: MenuItem): Promise<MenuItem> {
    const payload = {
      ...(item.code ? { code: item.code } : {}),
      category_id: item.categoryId || null,
      name: item.name,
      description: item.description || null,
      price: item.price,
      discount: item.discount,
      is_available: item.isAvailable,
      image_url: item.imageUrl || null,
    };

    if (item.id) {
      const { data, error } = await supabase.from('menu_items').update(payload).eq('id', item.id).select('*').single();
      if (error) throw asDbError(error, 'Unable to save menu item.');
      return mapMenuItemRow(data);
    }

    const { data, error } = await supabase.from('menu_items').insert(payload).select('*').single();
    if (error) throw asDbError(error, 'Unable to create menu item.');
    return mapMenuItemRow(data);
  },

  async deleteMenuItem(itemId: string): Promise<void> {
    const { error } = await supabase.from('menu_items').delete().eq('id', itemId);
    if (error) throw asDbError(error, 'Unable to delete menu item.');
  },
};
