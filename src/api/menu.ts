import { apiClient } from './client';
import type { MenuItem } from '@/types/menuItem';

export const menuApi = {
  listMenuItems(): Promise<MenuItem[]> {
    return apiClient.get<MenuItem[]>('/api/menu');
  },

  createMenuItem(item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem> {
    return apiClient.post<MenuItem>('/api/menu', item);
  },

  updateMenuItem(menuItemId: string, patch: Partial<MenuItem>): Promise<MenuItem> {
    return apiClient.patch<MenuItem>(`/api/menu/${menuItemId}`, patch);
  },

  deleteMenuItem(menuItemId: string): Promise<void> {
    return apiClient.delete(`/api/menu/${menuItemId}`);
  },
};
