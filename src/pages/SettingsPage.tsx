import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { settingsService } from '@/services/settingsService';

export const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [accountVisibility, setAccountVisibility] = useState<'private' | 'team'>('private');

  useEffect(() => {
    const current = settingsService.getSettings();
    setNotifications(current.notificationsEnabled);
    setAccountVisibility(current.accountVisibility);
  }, []);

  const save = () => {
    settingsService.saveSettings({ notificationsEnabled: notifications, accountVisibility });
    toast.success('Settings saved');
  };

  return (
    <div className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-4 max-w-2xl">
      <h2 className="text-xl font-semibold">Settings</h2>
      <label className="flex items-center justify-between">
        <span>Notification preferences</span>
        <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
      </label>
      <label className="block">Account settings
        <select className="block border rounded mt-1 px-2 py-1" value={accountVisibility} onChange={(e) => setAccountVisibility(e.target.value as 'private' | 'team')}>
          <option value="private">Private</option>
          <option value="team">Visible to team</option>
        </select>
      </label>
      <button className="rounded bg-indigo-600 text-white px-3 py-2" onClick={save}>Save settings</button>
    </div>
  );
};
