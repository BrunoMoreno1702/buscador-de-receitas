import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RecipeCard from '../../app/components/RecipeCard.vue'
import RecipeFilters from '../../app/components/RecipeFilters.vue'
import recipes from '../fixtures/recipes.json'

describe('RecipeCard', () => {
  it('mostra dados e aponta para a receita correta', () => {
    const wrapper = mount(RecipeCard, {
      props: { recipe: recipes[0]! },
      global: { stubs: { NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } } },
    })
    expect(wrapper.text()).toContain('Chicken Pasta')
    expect(wrapper.text()).toContain('30 min')
    expect(wrapper.text()).toContain('300 kcal')
    expect(wrapper.get('a').attributes('href')).toBe('/recipes/1')
  })

  it('apresenta fallback quando a imagem falha', async () => {
    const wrapper = mount(RecipeCard, {
      props: { recipe: recipes[0]! },
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } },
    })
    await wrapper.get('img').trigger('error')
    expect(wrapper.get('[role="img"]').text()).toContain('Imagem indisponível')
  })
})

describe('RecipeFilters', () => {
  it('emite alterações e o pedido para limpar filtros', async () => {
    const wrapper = mount(RecipeFilters, {
      props: { mealType: 'Dinner', cuisine: '', mealTypes: ['Dinner'], cuisines: ['Italian'] },
    })
    await wrapper.get('#cuisine').setValue('Italian')
    expect(wrapper.emitted('update:cuisine')?.[0]).toEqual(['Italian'])
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
