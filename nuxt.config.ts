export default defineNuxtConfig({ 
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-toastify'
  ],
  toastify: {
    autoClose: 3000,
    position: 'top-right',
    theme: 'light',
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    closeButton: true,
    hideProgressBar: false,
    newestOnTop: true,
    rtl: false,
    
  },
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
      apiBaseURL: process.env.API_BASE_URL || 'http://localhost:8080'
    }
  }
})
