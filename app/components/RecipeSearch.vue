<script setup lang="ts">
const query = ref('')
const emit = defineEmits<{ search: [value: string] }>()
</script>

<template>
  <form class="search-form" role="search" @submit.prevent="emit('search', query.trim())">
    <label class="sr-only" for="recipe-search">Buscar receita pelo nome</label>
    <span class="search-icon" aria-hidden="true">⌕</span>
    <input id="recipe-search" v-model="query" type="search" placeholder="O que você quer cozinhar? Ex.: chicken">
    <button class="button button--primary" type="submit">Buscar <span aria-hidden="true">↗</span></button>
  </form>
</template>
