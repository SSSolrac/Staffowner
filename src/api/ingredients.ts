import { apiClient } from './client';
import { asRecord, unwrapDataArray, unwrapDataObject } from './response';
import type { Ingredient, RecipeLine } from '@/types/ingredient';

const mapIngredient = (raw: unknown): Ingredient => {
  const row = asRecord(raw) ?? {};
  return {
    id: String(row.id ?? ''),
    code: String(row.code ?? ''),
    name: String(row.name ?? ''),
    unit: (String(row.unit ?? 'pcs') as Ingredient['unit']),
    stockOnHand: Number(row.stockOnHand ?? 0),
    reorderLevel: Number(row.reorderLevel ?? 0),
    isActive: Boolean(row.isActive ?? true),
    createdAt: String(row.createdAt ?? new Date().toISOString()),
    updatedAt: String(row.updatedAt ?? new Date().toISOString()),
  };
};

const mapRecipeLine = (raw: unknown): RecipeLine => {
  const row = asRecord(raw) ?? {};
  return {
    id: String(row.id ?? ''),
    menuItemId: String(row.menuItemId ?? ''),
    ingredientId: String(row.ingredientId ?? ''),
    quantityRequired: Number(row.quantityRequired ?? 0),
  };
};

export const ingredientsApi = {
  async listIngredients(): Promise<Ingredient[]> {
    const payload = await apiClient.get<unknown>('/api/ingredients');
    return unwrapDataArray<unknown>(payload).map(mapIngredient);
  },
  async saveIngredient(ingredient: Ingredient): Promise<Ingredient> {
    const payload = ingredient.id
      ? await apiClient.put<unknown>(`/api/ingredients/${ingredient.id}`, ingredient)
      : await apiClient.post<unknown>('/api/ingredients', ingredient);
    return mapIngredient(unwrapDataObject<unknown>(payload));
  },
  async deleteIngredient(id: string): Promise<void> {
    await apiClient.delete(`/api/ingredients/${id}`);
  },
  async listRecipeLines(menuItemId?: string): Promise<RecipeLine[]> {
    const payload = await apiClient.get<unknown>('/api/recipes', menuItemId ? { menuItemId } : undefined);
    return unwrapDataArray<unknown>(payload).map(mapRecipeLine);
  },
  async saveRecipeLine(line: RecipeLine): Promise<RecipeLine> {
    const payload = line.id
      ? await apiClient.put<unknown>(`/api/recipes/${line.id}`, line)
      : await apiClient.post<unknown>('/api/recipes', line);
    return mapRecipeLine(unwrapDataObject<unknown>(payload));
  },
  async deleteRecipeLine(id: string): Promise<void> {
    await apiClient.delete(`/api/recipes/${id}`);
  },
};
