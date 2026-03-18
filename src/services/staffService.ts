import type { StaffMember } from '@/types/staff';

const STAFF_KEY = 'staffowner_staff_members';

const seedStaff: StaffMember[] = [
  {
    id: 'u1',
    name: 'Olivia Owner',
    email: 'owner@happytails.com',
    role: 'owner',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 80).toISOString(),
  },
  {
    id: 'u2',
    name: 'Sean Staff',
    email: 'staff@happytails.com',
    role: 'staff',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  },
];

const readStore = (): StaffMember[] => {
  const raw = localStorage.getItem(STAFF_KEY);
  if (!raw) return seedStaff;

  try {
    return JSON.parse(raw) as StaffMember[];
  } catch {
    return seedStaff;
  }
};

const writeStore = (data: StaffMember[]) => {
  localStorage.setItem(STAFF_KEY, JSON.stringify(data));
};

export const staffService = {
  async list(): Promise<StaffMember[]> {
    await new Promise((resolve) => setTimeout(resolve, 120));
    return readStore();
  },

  async add(input: Omit<StaffMember, 'id' | 'createdAt'>): Promise<StaffMember> {
    const existing = readStore();
    const next: StaffMember = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    writeStore([next, ...existing]);
    return next;
  },
};
