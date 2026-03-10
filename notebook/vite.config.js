import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { createStyleImportPlugin } from 'vite-plugin-style-import'
// console.log(__dirname)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), createStyleImportPlugin({
    libs: [
      {
        libraryName: 'zarm',
        esModule: true,
        resolveStyle: name => `zarm/es/${name}/style/css`
      }
    ]
  })],
  css: {
    modules: {
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      // 针对 Less 预处理器的配置
     less: {
       // 允许在 Less 文件中使用内联 JavaScript
       javascriptEnabled: true,
     }
   }
  },
  resolve: {
    alias: {
      // 项目的物理路径
      '@': path.resolve(__dirname, 'src'),
      'utils': path.resolve(__dirname, 'src/utils'),
      '@views': path.resolve(__dirname, 'src/views')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  },
})
