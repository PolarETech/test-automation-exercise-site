import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'
import prerenderSpaPlugin from 'rollup-plugin-prerender-spa-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src')
    }
  },
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/style-vars.scss";'
      }
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        prerenderSpaPlugin({
          staticDir: path.join(__dirname, 'docs'),
          routes: ['/', '/about', '/login', '/todo']
        })
      ]
    },
    outDir: 'docs'
  },
  base: process.env.NODE_ENV === 'production'
    ? '/test-automation-exercise-site/'
    : '/'
})
