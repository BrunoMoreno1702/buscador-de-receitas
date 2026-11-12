<script setup lang="ts">
defineProps<{
  mealTypes: string[]
  cuisines: string[]
  mealType: string
  cuisine: string
}>()
const emit = defineEmits<{
  'update:mealType': [value: string]
  'update:cuisine': [value: string]
  clear: []
}>()
</script>

<template>
  <div class="filters">
    <div class="filter-field">
      <label for="meal-type">Categoria</label>
      <select id="meal-type" :value="mealType" @change="emit('update:mealType', ($event.target as HTMLSelectElement).value)">
        <option value="">Todas as categorias</option>
        <option v-for="option in mealTypes" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>
    <div class="filter-field">
      <label for="cuisine">Culinária</label>
      <select id="cuisine" :value="cuisine" @change="emit('update:cuisine', ($event.target as HTMLSelectElement).value)">
        <option value="">Todas as culinárias</option>
        <option v-for="option in cuisines" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>
    <button class="clear-filters" type="button" :disabled="!mealType && !cuisine" @click="emit('clear')">
      Limpar filtros
    </button>
  </div>
</template>
