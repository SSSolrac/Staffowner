import { menuApi } from '@/api/menu';
import type { MenuItem } from '@/types/menuItem';

export const menuService = {
  getMenuItems(): Promise<MenuItem[]> {
    return menuApi.listMenuItems();
  },

  saveMenuItem(item: MenuItem): Promise<MenuItem> {
    if (!item.id) {
      const { id: _unusedId, createdAt: _unusedCreatedAt, updatedAt: _unusedUpdatedAt, ...payload } = item;
      return menuApi.createMenuItem(payload);
    }
    return menuApi.updateMenuItem(item.id, item);
  },

  async deleteMenuItem(itemId: string): Promise<void> {
    await menuApi.deleteMenuItem(itemId);
  },
};
