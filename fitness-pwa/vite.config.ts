import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig({
plugins: [
react(),
VitePWA({
registerType: 'autoUpdate',
includeAssets: [],
manifest: {
name: 'FitnessApp',
short_name: 'Fitness',
description: 'Mini Fitness PWA',
theme_color: '#4f46e5',
background_color: '#4f46e5',
display: 'standalone',
icons: [
{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
]
}
})
]
})