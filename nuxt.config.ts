// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'nuxt-electron',
    '@nuxtjs/tailwindcss',
    'nuxt-lodash',
  ],
  css: [
    '@syncfusion/ej2-base/styles/tailwind.css',
    '@syncfusion/ej2-buttons/styles/tailwind.css',
    '@syncfusion/ej2-inputs/styles/tailwind.css',
  ],
  electron: {
    build: [
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.ts',
      },
      // {
      //   entry: 'electron/preload.ts',
      //   onstart(options) {
      //     // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
      //     // instead of restarting the entire Electron App.
      //     options.reload()
      //   },
      // },
    ],
    renderer: {},
  },
})
