<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), {
  message: 'Não foi possível carregar as receitas. Verifique sua conexão e tente novamente.',
})
defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="state-panel" role="alert">
    <span class="state-icon" aria-hidden="true">!</span>
    <h2>Ops, algo deu errado</h2>
    <p>{{ message }}</p>
    <button class="button button--primary" type="button" @click="$emit('retry')">Tentar novamente</button>
  </div>
</template>
