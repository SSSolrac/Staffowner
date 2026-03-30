import { apiClient } from './client';
import type { DailyMenu } from '@/types/dailyMenu';

export const dailyMenuApi = {
  list(): Promise<DailyMenu[]> {
    return apiClient.get<DailyMenu[]>('/api/menu/daily');
  },

  create(payload: Omit<DailyMenu, 'id' | 'createdAt' | 'updatedAt'>): Promise<DailyMenu> {
    return apiClient.post<DailyMenu>('/api/menu/daily', payload);
  },

  update(dailyMenuId: string, payload: Partial<DailyMenu>): Promise<DailyMenu> {
    return apiClient.patch<DailyMenu>(`/api/menu/daily/${dailyMenuId}`, payload);
  },

  publish(dailyMenuId: string): Promise<DailyMenu> {
    return apiClient.patch<DailyMenu>(`/api/menu/daily/${dailyMenuId}/publish`);
  },
};
