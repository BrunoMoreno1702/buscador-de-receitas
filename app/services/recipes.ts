import type { Recipe, RecipesResponse } from '../types/recipe'

function getApiBase() {
  return useRuntimeConfig().public.recipesApiBase.replace(/\/+$/, '')
}

export function getRecipes(signal?: AbortSignal) {
  return $fetch<RecipesResponse>(getApiBase(), {
    query: { limit: 0 },
    signal,
    retry: 0,
  })
}

export function searchRecipes(query: string, signal?: AbortSignal) {
  return $fetch<RecipesResponse>(`${getApiBase()}/search`, {
    query: { q: query, limit: 0 },
    signal,
    retry: 0,
  })
}

export function getRecipeById(id: string, signal?: AbortSignal) {
  return $fetch<Recipe>(`${getApiBase()}/${encodeURIComponent(id)}`, {
    signal,
    retry: 0,
  })
}
