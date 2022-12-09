import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/notes-to-image/' : '/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      includeAssets: ['logo-outlined.svg', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Berbagi Catatan',
        short_name: 'Berbagi Catatan',
        start_url: '/notes-to-image/',
        scope: '/notes-to-image/',
        description: 'Cara lebih mudah untuk berbagi kebaikan',
        theme_color: '#7D7268',
        background_color: '#ffffff',
        lang: 'id',
        dir: 'ltr',
        display: 'standalone',
        categories: [
          'productivity',
          'utilities'
        ],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        screenshots: [
          {
            src: 'screenshot.jpg',
            sizes: '719x1280',
            type: 'image/jpg'
          }
        ]
      }
    })
  ]
}))
