<script setup lang="ts">
import { ref } from 'vue'
import type { Recipe } from '../types/recipe'

defineProps<{ recipe: Recipe }>()
const imageFailed = ref(false)
</script>

<template>
  <article class="recipe-card">
    <NuxtLink :to="`/recipes/${recipe.id}`" class="recipe-card__link">
      <div class="recipe-card__media">
        <img v-if="!imageFailed" :src="recipe.image" :alt="recipe.name" loading="lazy" @error="imageFailed = true">
        <div v-else class="image-fallback" role="img" :aria-label="`Imagem indisponível: ${recipe.name}`">
          Imagem indisponível
        </div>
        <span class="card-rating"><span aria-hidden="true">★</span> {{ recipe.rating.toFixed(1) }}</span>
      </div>
      <div class="recipe-card__body">
        <span class="eyebrow card-cuisine">{{ recipe.cuisine }}</span>
        <h3>{{ recipe.name }}</h3>
        <div class="recipe-card__meta">
          <span><span aria-hidden="true">◷</span> {{ recipe.prepTimeMinutes + recipe.cookTimeMinutes }} min</span>
          <span><span aria-hidden="true">◒</span> {{ recipe.caloriesPerServing }} kcal / porção</span>
        </div>
        <span class="card-action">Ver receita <span aria-hidden="true">↗</span></span>
      </div>
    </NuxtLink>
  </article>
</template>
