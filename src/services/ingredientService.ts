import { ingredientsApi } from '@/api/ingredients';
import type { Ingredient, RecipeLine } from '@/types/ingredient';

export const ingredientService = {
  listIngredients(): Promise<Ingredient[]> {
    return ingredientsApi.listIngredients();
  },
  saveIngredient(ingredient: Ingredient): Promise<Ingredient> {
    return ingredientsApi.saveIngredient(ingredient);
  },
  deleteIngredient(id: string): Promise<void> {
    return ingredientsApi.deleteIngredient(id);
  },
  listRecipeLines(menuItemId?: string): Promise<RecipeLine[]> {
    return ingredientsApi.listRecipeLines(menuItemId);
  },
  saveRecipeLine(line: RecipeLine): Promise<RecipeLine> {
    return ingredientsApi.saveRecipeLine(line);
  },
  deleteRecipeLine(id: string): Promise<void> {
    return ingredientsApi.deleteRecipeLine(id);
  },
};
