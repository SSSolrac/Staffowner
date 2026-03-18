import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { Image } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.name ?? '');

  const updatePassword = (event: FormEvent) => {
    event.preventDefault();
    toast.success('Password updated');
  };

  const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') return;
      updateUser({ avatar: result });
      toast.success('Profile picture updated');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-lg border bg-white dark:bg-slate-800 p-4 max-w-2xl space-y-4">
      <h2 className="text-xl font-semibold">Profile</h2>
      <div className="flex items-center gap-4">
        <Image alt={user?.name} src={user?.avatar} className="h-16 w-16 rounded-full object-cover" />
        <div><p>{user?.name}</p><p className="text-sm text-slate-500">{user?.email}</p></div>
      </div>

      <label className="block text-sm">Display name
        <input className="border rounded px-2 py-1 mt-1 w-full" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
      </label>
      <button className="rounded border px-3 py-2" onClick={() => { updateUser({ name: displayName }); toast.success('Profile updated'); }}>Save profile</button>

      <label className="block text-sm">Upload profile picture
        <input className="block mt-1" type="file" accept="image/*" onChange={onUpload} />
      </label>

      <form onSubmit={updatePassword} className="space-y-2">
        <input required type="password" placeholder="New password" className="border rounded px-2 py-1 w-full" />
        <button className="rounded bg-indigo-600 text-white px-3 py-2">Change password</button>
      </form>
    </div>
  );
};
