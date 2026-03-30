import { apiClient } from './client';

export interface Profile {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const profileApi = {
  getMe(): Promise<Profile> {
    return apiClient.get<Profile>('/api/profile/me');
  },
  updateMe(payload: Partial<Profile>): Promise<Profile> {
    return apiClient.put<Profile>('/api/profile/me', payload);
  },
};
