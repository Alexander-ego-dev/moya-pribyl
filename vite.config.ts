import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({base:process.env.BASE_PATH || '/',plugins:[react(),tailwind(),VitePWA({registerType:'prompt',includeAssets:['apple-touch-icon.png','icon.svg'],manifest:{name:'Моя прибыль',short_name:'Моя прибыль',lang:'ru',description:'Личный учёт доходов, расходов и целей',theme_color:'#202020',background_color:'#F7F7F5',display:'standalone',start_url:'.',scope:'.',icons:[{src:'icon-192.png',sizes:'192x192',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'},{src:'icon-maskable.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]},workbox:{globPatterns:['**/*.{js,css,html,png,svg,webmanifest}'],maximumFileSizeToCacheInBytes:3000000}})]});
