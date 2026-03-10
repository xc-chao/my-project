import { defineConfig } from 'vite';
import UniPlugin from '@dcloudio/vite-plugin-uni';

const uni = (UniPlugin as any).default || UniPlugin;

export default defineConfig({
  plugins: [uni()]
});
