import { dailyMenuApi } from '@/api/dailyMenu';
import type { DailyMenu } from '@/types/dailyMenu';

export const dailyMenuService = {
  async getCurrentDailyMenu(): Promise<DailyMenu> {
    const rows = await dailyMenuApi.list();
    return rows[0] ?? {
      id: '',
      menuDate: new Date().toISOString().slice(0, 10),
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
    };
  },

  async saveDailyMenu(menu: DailyMenu): Promise<DailyMenu> {
    if (!menu.id) {
      return dailyMenuApi.create({
        menuDate: menu.menuDate,
        isPublished: menu.isPublished,
        items: menu.items,
      });
    }
    return dailyMenuApi.update(menu.id, menu);
  },

  async publishDailyMenu(menu: DailyMenu): Promise<DailyMenu> {
    const saved = await this.saveDailyMenu(menu);
    return dailyMenuApi.publish(saved.id);
  },

  async unpublishDailyMenu(): Promise<DailyMenu> {
    const current = await this.getCurrentDailyMenu();
    if (!current.id) return current;
    return dailyMenuApi.update(current.id, { isPublished: false });
  },

  async clearDailyMenu(): Promise<DailyMenu> {
    const current = await this.getCurrentDailyMenu();
    if (!current.id) return current;
    return dailyMenuApi.update(current.id, { items: [] });
  },
};
