export type DailyMenuItem = {
  id: string;
  dailyMenuId: string;
  menuItemId: string;
  isAvailable: boolean;
  sortOrder: number;
};

export type DailyMenu = {
  id: string;
  menuDate: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  items: DailyMenuItem[];
};
