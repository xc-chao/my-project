import { defineConfig } from 'vite';
import UniPlugin from '@dcloudio/vite-plugin-uni';

const uni = (UniPlugin as any).default || UniPlugin;

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api', 'import']
      }
    }
  },
  plugins: [uni()]
});
