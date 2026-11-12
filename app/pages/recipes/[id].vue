<script setup lang="ts">
import { getRecipeById } from '../../services/recipes'

const route = useRoute()
const recipeId = computed(() => String(route.params.id))
const checkedIngredients = ref<number[]>([])
const imageFailed = ref(false)

const {
  data: recipe,
  status,
  error,
  refresh,
} = await useAsyncData(
  () => `recipe-${recipeId.value}`,
  (_nuxtApp, { signal }) => {
    if (!/^[1-9]\d*$/.test(recipeId.value)) {
      throw createError({ statusCode: 404, statusMessage: 'Receita não encontrada' })
    }
    return getRecipeById(recipeId.value, signal)
  },
)

const notFound = computed(() => error.value?.statusCode === 404)
const requestEvent = useRequestEvent()
if (error.value && requestEvent) {
  setResponseStatus(requestEvent, notFound.value ? 404 : 503)
}
watch(recipeId, () => {
  checkedIngredients.value = []
  imageFailed.value = false
})

useSeoMeta({
  title: () => recipe.value ? `${recipe.value.name} | Receita em Dia` : 'Receita | Receita em Dia',
  description: () => recipe.value
    ? `Confira os ingredientes e o preparo de ${recipe.value.name}.`
    : 'Confira os detalhes da receita.',
})
</script>

<template>
  <div class="container detail-page">
    <NuxtLink class="back-link" to="/"><span aria-hidden="true">←</span> Todas as receitas</NuxtLink>
    <LoadingState v-if="status === 'pending' || status === 'idle'" />
    <div v-else-if="error && notFound" class="state-panel" role="alert">
      <span class="state-icon" aria-hidden="true">?</span>
      <h1>Receita não encontrada</h1>
      <p>Não encontramos uma receita com este endereço.</p>
      <NuxtLink class="button button--primary" to="/">Explorar receitas</NuxtLink>
    </div>
    <ErrorState v-else-if="error" message="Não foi possível carregar esta receita. Verifique sua conexão e tente novamente." @retry="refresh()" />
    <article v-else-if="recipe">
      <div class="detail-intro">
        <div class="detail-image">
          <img v-if="!imageFailed" :src="recipe.image" :alt="recipe.name" @error="imageFailed = true">
          <div v-else class="image-fallback" role="img" :aria-label="`Imagem indisponível: ${recipe.name}`">Imagem indisponível</div>
        </div>
        <div class="detail-summary">
          <p class="eyebrow">{{ recipe.cuisine }} · {{ recipe.mealType.join(' / ') }}</p>
          <h1>{{ recipe.name }}<span class="heading-dot">.</span></h1>
          <p class="detail-rating"><span aria-hidden="true">★</span> {{ recipe.rating.toFixed(1) }} <span>({{ recipe.reviewCount }} avaliações)</span></p>
          <p class="detail-description">Tudo o que você precisa para preparar esta receita. Separe os ingredientes e mãos à obra!</p>
          <dl class="detail-facts">
            <div><dt>Preparo</dt><dd>{{ recipe.prepTimeMinutes }} min</dd></div>
            <div><dt>Cozimento</dt><dd>{{ recipe.cookTimeMinutes }} min</dd></div>
            <div><dt>Tempo total</dt><dd>{{ recipe.prepTimeMinutes + recipe.cookTimeMinutes }} min</dd></div>
            <div><dt>Porções</dt><dd>{{ recipe.servings }}</dd></div>
            <div><dt>Calorias / porção</dt><dd>{{ recipe.caloriesPerServing }} kcal</dd></div>
            <div><dt>Dificuldade</dt><dd>{{ recipe.difficulty }}</dd></div>
          </dl>
        </div>
      </div>
      <div class="detail-content">
        <section class="ingredients-panel" aria-labelledby="ingredients-title">
          <p class="eyebrow">ANTES DE COMEÇAR</p>
          <h2 id="ingredients-title">Ingredientes<span class="heading-dot">.</span></h2>
          <p class="muted">Marque os ingredientes que já separou.</p>
          <ul class="ingredients-list">
            <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
              <label>
                <input v-model="checkedIngredients" type="checkbox" :value="index">
                <span>{{ ingredient }}</span>
              </label>
            </li>
          </ul>
          <p class="ingredient-progress">{{ checkedIngredients.length }} de {{ recipe.ingredients.length }} separados</p>
        </section>
        <section class="instructions-panel" aria-labelledby="instructions-title">
          <p class="eyebrow">MÃOS À OBRA</p>
          <h2 id="instructions-title">Modo de preparo<span class="heading-dot">.</span></h2>
          <p class="muted">Siga os passos e aproveite o processo.</p>
          <ol class="instructions-list">
            <li v-for="(instruction, index) in recipe.instructions" :key="index">
              <span class="step-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
              <span>{{ instruction }}</span>
            </li>
          </ol>
        </section>
      </div>
    </article>
  </div>
</template>
