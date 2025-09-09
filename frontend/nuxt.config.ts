export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-09-09',
  devServer: {
    port: 3100
  },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/apollo',
    '@vueuse/nuxt'
  ],

  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
        wsEndpoint: process.env.NUXT_PUBLIC_WS_URL || 'ws://localhost:4000/graphql',
      }
    }
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
    }
  },

  css: ['~/assets/css/main.css'],

  typescript: {
    typeCheck: true,
    strict: false
  },

  ssr: false, // SPA mode for better performance with large datasets
}) 
