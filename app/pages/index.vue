<script setup lang="ts">
import { getRecipes, searchRecipes } from '../services/recipes'
import { filterRecipes, filterRecipesByName, getFilterOptions } from '../utils/filterRecipes'

useSeoMeta({
  title: 'Receita em Dia | Encontre sua próxima receita',
  description: 'Encontre receitas e filtre por categoria e culinária para descobrir sua próxima refeição.',
})

const searchTerm = ref('')
const mealType = ref('')
const cuisine = ref('')

const {
  data: catalog,
  status: catalogStatus,
  error: catalogError,
  refresh: refreshCatalog,
} = await useAsyncData('recipe-catalog', (_nuxtApp, { signal }) => getRecipes(signal))

const requestEvent = useRequestEvent()
if (catalogError.value && requestEvent) {
  setResponseStatus(requestEvent, 503)
}

const {
  data: searchResults,
  status: searchStatus,
  error: searchError,
  execute: executeSearch,
  clear: clearSearch,
} = await useAsyncData(
  'recipe-search',
  (_nuxtApp, { signal }) => searchRecipes(searchTerm.value, signal),
  { immediate: false, server: false },
)

const options = computed(() => getFilterOptions(catalog.value?.recipes ?? []))
const isSearching = computed(() => searchTerm.value !== '')
const visibleRecipes = computed(() => {
  const recipes = isSearching.value
    ? filterRecipesByName(searchResults.value?.recipes ?? [], searchTerm.value)
    : catalog.value?.recipes ?? []
  return filterRecipes(recipes, { mealType: mealType.value, cuisine: cuisine.value })
})

function handleSearch(query: string) {
  clearSearch()
  searchTerm.value = query.trim()
  if (searchTerm.value) {
    void executeSearch({ dedupe: 'cancel' })
  }
}

function clearFilters() {
  mealType.value = ''
  cuisine.value = ''
}
</script>

<template>
  <div>
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-copy">
          <p class="eyebrow hero-label"><span aria-hidden="true">✳</span> UM POUCO DE INSPIRAÇÃO PARA O SEU DIA</p>
          <h1>O próximo prato<br>favorito <em>começa aqui.</em></h1>
          <p class="hero-description">Ideias deliciosas para todos os momentos. Encontre uma receita, separe os ingredientes e aproveite.</p>
          <RecipeSearch @search="handleSearch" />
          <p class="search-hint">Dica: as receitas estão em inglês. Experimente “chicken” ou “pizza”.</p>
        </div>
        <div class="hero-art" aria-hidden="true">
          <div class="hero-art__circle">
            <img src="https://cdn.dummyjson.com/recipe-images/1.webp" alt="">
          </div>
          <span class="hero-art__badge">feito para<br><strong>descobrir ✳</strong></span>
          <span class="hero-art__sparkle">✺</span>
        </div>
      </div>
    </section>

    <section class="container recipes-section" aria-labelledby="recipes-heading">
      <div class="section-heading">
        <div>
          <p class="eyebrow">ENCONTRE SUA INSPIRAÇÃO</p>
          <h2 id="recipes-heading">Explore as receitas<span class="heading-dot">.</span></h2>
        </div>
        <p>Encontre algo especial para levar à mesa.</p>
      </div>

      <LoadingState v-if="catalogStatus === 'pending' || catalogStatus === 'idle'" />
      <ErrorState v-else-if="catalogError" @retry="refreshCatalog()" />
      <template v-else>
        <RecipeFilters
          v-model:meal-type="mealType"
          v-model:cuisine="cuisine"
          :meal-types="options.mealTypes"
          :cuisines="options.cuisines"
          @clear="clearFilters"
        />
        <LoadingState v-if="isSearching && (searchStatus === 'pending' || searchStatus === 'idle')" />
        <ErrorState v-else-if="isSearching && searchError" message="Não foi possível realizar a busca. Verifique sua conexão e tente novamente." @retry="executeSearch()" />
        <template v-else>
          <div class="results-heading" aria-live="polite">
            <p><strong>{{ visibleRecipes.length }}</strong> {{ visibleRecipes.length === 1 ? 'receita encontrada' : 'receitas encontradas' }}</p>
            <p v-if="isSearching">Resultados para <strong>“{{ searchTerm }}”</strong></p>
          </div>
          <EmptyState v-if="visibleRecipes.length === 0" />
          <div v-else class="recipe-grid">
            <RecipeCard v-for="recipe in visibleRecipes" :key="recipe.id" :recipe="recipe" />
          </div>
        </template>
      </template>
    </section>
  </div>
</template>
