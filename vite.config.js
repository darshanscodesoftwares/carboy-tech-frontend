import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'MYCARBOY EXPERTS',
        short_name: 'MyCarBoy',
        description: 'MyCarBoy Technician Inspection App',
        theme_color: '#2C7A7A',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: "./public/repair.svg",
            sizes: '192x192',
            type: 'image/svg'
          },
          {
            src: "./public/repair.svg",
            sizes: '512x512',
            type: 'image/svg' 
          }
        ]
      }
    })
  ]
})
