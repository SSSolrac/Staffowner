import { supabase } from '@/lib/supabase';
import { asRecord, mapDailyMenuItemRow, mapDailyMenuRow } from '@/lib/mappers';
import type { DailyMenu } from '@/types/dailyMenu';

const asDbError = (error: unknown, fallback = 'Database request failed.') => {
  const message = asRecord(error)?.message;
  if (typeof message === 'string' && message.trim()) return new Error(message);
  if (error instanceof Error && error.message.trim()) return new Error(error.message);
  return new Error(fallback);
};

const formatDate = (value: string) => (value.length >= 10 ? value.slice(0, 10) : new Date().toISOString().slice(0, 10));

const requireUserId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw asDbError(error, 'Unable to load session.');
  if (!data.user) throw new Error('You must be signed in.');
  return data.user.id;
};

export const dailyMenuService = {
  async getDailyMenu(menuDate: string): Promise<DailyMenu> {
    const date = formatDate(menuDate);

    const { data: menuRow, error: menuError } = await supabase
      .from('daily_menus')
      .select('*')
      .eq('menu_date', date)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (menuError) throw asDbError(menuError, 'Unable to load daily menu.');
    if (!menuRow) {
      const now = new Date().toISOString();
      return {
        id: '',
        menuDate: date,
        isPublished: false,
        createdBy: null,
        createdAt: now,
        updatedAt: now,
        items: [],
      };
    }

    const { data: itemRows, error: itemsError } = await supabase
      .from('daily_menu_items')
      .select('*')
      .eq('daily_menu_id', menuRow.id);

    if (itemsError) throw asDbError(itemsError, 'Unable to load daily menu items.');
    const items = (Array.isArray(itemRows) ? itemRows : []).map(mapDailyMenuItemRow);
    return mapDailyMenuRow(menuRow, items);
  },

  async getCurrentDailyMenu(): Promise<DailyMenu> {
    const today = new Date().toISOString().slice(0, 10);
    return this.getDailyMenu(today);
  },

  async saveDailyMenu(menu: DailyMenu): Promise<DailyMenu> {
    const userId = await requireUserId();
    const menuDate = formatDate(menu.menuDate);

    const upsertPayload = {
      menu_date: menuDate,
      is_published: Boolean(menu.isPublished),
      created_by: userId,
      updated_at: new Date().toISOString(),
    };

    const { data: savedMenu, error: saveError } = await supabase
      .from('daily_menus')
      .upsert(upsertPayload, { onConflict: 'menu_date' })
      .select('*')
      .single();

    if (saveError) throw asDbError(saveError, 'Unable to save daily menu.');

    const menuId = savedMenu.id;
    const nextMenuItemIds = (menu.items ?? []).map((item) => item.menuItemId).filter(Boolean);

    // Replace items for this menu id.
    const { error: deleteError } = await supabase.from('daily_menu_items').delete().eq('daily_menu_id', menuId);
    if (deleteError) throw asDbError(deleteError, 'Unable to update daily menu items.');

    if (nextMenuItemIds.length) {
      const insertRows = nextMenuItemIds.map((menuItemId) => ({ daily_menu_id: menuId, menu_item_id: menuItemId }));
      const { error: insertError } = await supabase.from('daily_menu_items').insert(insertRows);
      if (insertError) throw asDbError(insertError, 'Unable to save daily menu items.');
    }

    const { data: itemRows, error: itemsError } = await supabase.from('daily_menu_items').select('*').eq('daily_menu_id', menuId);
    if (itemsError) throw asDbError(itemsError, 'Unable to load saved daily menu items.');

    return mapDailyMenuRow(savedMenu, (Array.isArray(itemRows) ? itemRows : []).map(mapDailyMenuItemRow));
  },

  async publishDailyMenu(menuDate: string): Promise<DailyMenu> {
    const date = formatDate(menuDate);
    const { data: updated, error } = await supabase
      .from('daily_menus')
      .update({ is_published: true, updated_at: new Date().toISOString() })
      .eq('menu_date', date)
      .select('*')
      .single();

    if (error) throw asDbError(error, 'Unable to publish daily menu.');
    const { data: itemRows } = await supabase.from('daily_menu_items').select('*').eq('daily_menu_id', updated.id);
    return mapDailyMenuRow(updated, (Array.isArray(itemRows) ? itemRows : []).map(mapDailyMenuItemRow));
  },

  async unpublishDailyMenu(menuDate: string): Promise<DailyMenu> {
    const date = formatDate(menuDate);
    const { data: updated, error } = await supabase
      .from('daily_menus')
      .update({ is_published: false, updated_at: new Date().toISOString() })
      .eq('menu_date', date)
      .select('*')
      .single();

    if (error) throw asDbError(error, 'Unable to unpublish daily menu.');
    const { data: itemRows } = await supabase.from('daily_menu_items').select('*').eq('daily_menu_id', updated.id);
    return mapDailyMenuRow(updated, (Array.isArray(itemRows) ? itemRows : []).map(mapDailyMenuItemRow));
  },

  async clearDailyMenu(menuDate: string): Promise<DailyMenu> {
    const date = formatDate(menuDate);
    const { data: menuRow, error: menuError } = await supabase
      .from('daily_menus')
      .select('*')
      .eq('menu_date', date)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (menuError) throw asDbError(menuError, 'Unable to load daily menu.');
    if (!menuRow) {
      const now = new Date().toISOString();
      return {
        id: '',
        menuDate: date,
        isPublished: false,
        createdBy: null,
        createdAt: now,
        updatedAt: now,
        items: [],
      };
    }

    const menuId = menuRow.id;
    const { error: deleteError } = await supabase.from('daily_menu_items').delete().eq('daily_menu_id', menuId);
    if (deleteError) throw asDbError(deleteError, 'Unable to clear daily menu items.');

    const { data: updated, error: updateError } = await supabase
      .from('daily_menus')
      .update({ is_published: false, updated_at: new Date().toISOString() })
      .eq('id', menuId)
      .select('*')
      .single();

    if (updateError) throw asDbError(updateError, 'Unable to clear daily menu.');
    return mapDailyMenuRow(updated, []);
  },
};
