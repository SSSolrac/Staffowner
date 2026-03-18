import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { staffService } from '@/services/staffService';
import type { StaffMember } from '@/types/staff';

export const StaffManagementPage = () => {
  const [rows, setRows] = useState<StaffMember[]>([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'staff' as 'staff' | 'owner', avatar: '' });

  useEffect(() => {
    staffService.list().then(setRows);
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Name and email are required.');
      return;
    }

    const created = await staffService.add(form);
    setRows((previous) => [created, ...previous]);
    setForm({ name: '', email: '', role: 'staff', avatar: '' });
    toast.success('Staff member added.');
  };

  return (
    <div className="space-y-4">
      <section className="rounded-lg border bg-white dark:bg-slate-800 p-4 max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">Add staff member</h2>
        <form className="space-y-2" onSubmit={onSubmit}>
          <input className="border rounded px-2 py-1 w-full" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="border rounded px-2 py-1 w-full" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="border rounded px-2 py-1 w-full" placeholder="Avatar URL (optional)" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
          <select className="border rounded px-2 py-1 w-full" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'staff' | 'owner' })}>
            <option value="staff">Staff</option>
            <option value="owner">Owner</option>
          </select>
          <button className="rounded bg-indigo-600 text-white px-3 py-2">Create account</button>
        </form>
      </section>

      <section className="rounded-lg border bg-white dark:bg-slate-800 p-4">
        <h3 className="font-medium mb-2">Current team members</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left"><th>Name</th><th>Email</th><th>Role</th><th>Added</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-t" key={row.id}>
                <td>{row.name}</td><td>{row.email}</td><td className="capitalize">{row.role}</td><td>{new Date(row.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};
