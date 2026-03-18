import type { AppNotification } from '@/types/notification';

const NOTIFICATIONS_KEY = 'staffowner_notifications';

const seedNotifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'Daily report ready',
    description: 'Your daily sales and membership report is available for export.',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    read: false,
  },
  {
    id: 'n2',
    title: 'New member registered',
    description: 'A new member has been added to the Silver tier today.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: false,
  },
];

const readStore = (): AppNotification[] => {
  const raw = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!raw) return seedNotifications;

  try {
    return JSON.parse(raw) as AppNotification[];
  } catch {
    return seedNotifications;
  }
};

const writeStore = (data: AppNotification[]) => {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(data));
};

export const notificationService = {
  async list(): Promise<AppNotification[]> {
    await new Promise((resolve) => setTimeout(resolve, 120));
    return readStore().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },

  markAllRead(): void {
    const current = readStore();
    writeStore(current.map((item) => ({ ...item, read: true })));
  },

  add(title: string, description: string): AppNotification {
    const current = readStore();
    const next: AppNotification = {
      id: crypto.randomUUID(),
      title,
      description,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const updated = [next, ...current];
    writeStore(updated);
    return next;
  },
};
