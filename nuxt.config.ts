// nuxt.config.ts
export default defineNuxtConfig({ 
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css'
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      // Provide API base URL here
      apiBaseURL: process.env.API_BASE_URL || 'http://localhost:8080'
    }
  }
})
