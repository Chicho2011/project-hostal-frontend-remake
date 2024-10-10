// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: false,

  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ["@nuxt/eslint", "nuxt-auth-sanctum", "nuxt-quasar-ui", "@pinia/nuxt"],
  runtimeConfig: {
    public: {
      API_ENDPOINT: process.env.NUXT_API_ENDPOINT
    }
  },

  sanctum: {
    baseUrl: process.env.NUXT_API_ENDPOINT,
    mode: 'token',
    endpoints: {
      login: 'api/login'
    },
    redirect: {
      onLogin: '/dashboard'
    },
    logLevel: 5
  },
  quasar: {
    plugins: ['Notify']
  }
})