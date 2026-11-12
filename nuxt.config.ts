// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      recipesApiBase: 'https://dummyjson.com/recipes',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      title: 'Receita em Dia',
      meta: [{ name: 'theme-color', content: '#f8f6f0' }],
    },
  },
})
