// frontend/vite.config.dev.ts
import { defineConfig, mergeConfig } from 'vite'
import baseConfig from './vite.config.base'

export default mergeConfig(
  baseConfig,
  defineConfig({
    mode: 'development',
    server: {
      host: true,
      port: 5173,
      watch: {
        usePolling: true
      },
      proxy: {
        '/api': {
          target: 'http://backend:3000',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    define: {
      'process.env.NODE_ENV': '"development"'
    }
  })
)