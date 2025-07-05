import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa' // Import the PWA plugin

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    VitePWA({
      // manifest: {
      //   name: 'TicketMaster App',
      //   short_name: 'TicketMaster',
      //   description: 'Your go-to app for ticket booking!',
      //   start_url: '/',
      //   display: 'standalone',
      //   background_color: '#ffffff',
      //   theme_color: '#121212',
      //   icons: [
      //     {
      //       src: '/ticketmL.jpg',
      //       sizes: '192x192',
      //       type: 'image/jpg',
      //     },
      //     {
      //       src: '/ticketmL.jpg',
      //       sizes: '512x512',
      //       type: 'image/jpg',
      //     },
      //   ],
      // },

      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/your-api-domain\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 1 day
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

// import { fileURLToPath, URL } from 'node:url'

// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import vueJsx from '@vitejs/plugin-vue-jsx'
// import vueDevTools from 'vite-plugin-vue-devtools'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//     vueJsx(),
//     vueDevTools(),
//   ],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     }
//   }
// })
