import { describe, expect, it } from 'vitest'
import recipes from '../fixtures/recipes.json'
import { filterRecipes, filterRecipesByName, getFilterOptions } from '../../app/utils/filterRecipes'

describe('filtros de receitas', () => {
  it('mantém todas as receitas sem filtros', () => {
    expect(filterRecipes(recipes, { mealType: '', cuisine: '' })).toHaveLength(3)
  })

  it('aplica categoria e culinária individualmente e em conjunto', () => {
    expect(filterRecipes(recipes, { mealType: 'Dinner', cuisine: '' })).toHaveLength(2)
    expect(filterRecipes(recipes, { mealType: '', cuisine: 'Italian' })).toHaveLength(2)
    expect(filterRecipes(recipes, { mealType: 'Dinner', cuisine: 'Italian' }).map(recipe => recipe.id)).toEqual([1])
    expect(filterRecipes(recipes, { mealType: 'Dessert', cuisine: 'Mexican' })).toEqual([])
  })

  it('confere o nome sem diferenciar maiúsculas e espaços externos', () => {
    expect(filterRecipesByName(recipes, ' CHICKEN ').map(recipe => recipe.id)).toEqual([1, 2])
    expect(filterRecipesByName(recipes, 'pasta').map(recipe => recipe.id)).toEqual([1])
  })

  it('gera opções únicas e ordenadas do catálogo', () => {
    expect(getFilterOptions(recipes)).toEqual({
      mealTypes: ['Dessert', 'Dinner'],
      cuisines: ['Italian', 'Mexican'],
    })
  })
})
