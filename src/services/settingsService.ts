import type { AppSettings } from '@/types/settings';

const SETTINGS_KEY = 'staffowner_settings';

const defaultSettings: AppSettings = {
  notificationsEnabled: true,
  accountVisibility: 'private',
};

export const settingsService = {
  getSettings(): AppSettings {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;

    try {
      return { ...defaultSettings, ...(JSON.parse(raw) as Partial<AppSettings>) };
    } catch {
      return defaultSettings;
    }
  },

  saveSettings(next: AppSettings): AppSettings {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    return next;
  },
};
