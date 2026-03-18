export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'staff' | 'owner';
  avatar?: string;
  createdAt: string;
}
