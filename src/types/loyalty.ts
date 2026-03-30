export const LOYALTY_TOTAL_STAMPS = 10;

export const LOYALTY_MILESTONE_REWARDS: Record<number, string> = {
  6: 'Free Latte',
  10: 'Free Groom',
};

export interface LoyaltyAccount {
  customerId: string;
  currentStampCount: number;
  totalStampsEarned: number;
  rewardsUnlocked: string[];
  lastStampedOrderId?: string | null;
  updatedAt: string;
}

export interface LoyaltyStampResult {
  granted: boolean;
  stampedAt?: string;
  reason?: string;
  loyaltyAccount?: LoyaltyAccount;
}
