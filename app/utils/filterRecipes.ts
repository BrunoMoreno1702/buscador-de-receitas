import type { Recipe } from '../types/recipe'

export interface RecipeFilters {
  mealType: string
  cuisine: string
}

export function filterRecipes(recipes: Recipe[], filters: RecipeFilters): Recipe[] {
  return recipes.filter(recipe =>
    (!filters.mealType || recipe.mealType.includes(filters.mealType))
    && (!filters.cuisine || recipe.cuisine === filters.cuisine),
  )
}

export function filterRecipesByName(recipes: Recipe[], query: string): Recipe[] {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  return recipes.filter(recipe => recipe.name.toLocaleLowerCase().includes(normalizedQuery))
}

export function getFilterOptions(recipes: Recipe[]) {
  return {
    mealTypes: [...new Set(recipes.flatMap(recipe => recipe.mealType))].sort(),
    cuisines: [...new Set(recipes.map(recipe => recipe.cuisine))].sort(),
  }
}
