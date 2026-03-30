export type MenuItem = {
  id: string;
  categoryId?: string | null;
  name: string;
  description?: string | null;
  price: number;
  isAvailable: boolean;
  imageUrl?: string | null;
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
