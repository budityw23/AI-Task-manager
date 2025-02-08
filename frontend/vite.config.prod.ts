// frontend/vite.config.prod.ts
import { defineConfig, mergeConfig } from 'vite'
import baseConfig from './vite.config.base'

export default mergeConfig(
  baseConfig,
  defineConfig({
    mode: 'production',
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom']
            // We'll add UI vendor chunk later when we have the components
          }
        }
      }
    },
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  })
)