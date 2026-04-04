export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type MenuItem = {
  id: string;
  code: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  manualAvailabilityOverride?: boolean;
  imageUrl: string | null;
  discount: number;
  createdAt: string;
  updatedAt: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
