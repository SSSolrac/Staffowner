import type { LoyaltyAccount } from './loyalty';

export type CustomerTier = 'Gold' | 'Silver' | 'Bronze' | 'Unranked';

export interface CustomerProfile {
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

export interface CustomerWithLoyalty extends CustomerProfile {
  loyalty: LoyaltyAccount;
}