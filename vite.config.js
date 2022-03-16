// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
import { readFileSync } from 'fs';

const { dependencies = {}, devDependencies = {} } = JSON.parse(readFileSync('./package.json'));

const external = Object.keys({ ...dependencies, ...devDependencies });
export default defineConfig({
  esbuild: {
    minify: true,
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        globals: {
          axios: 'axios',
        },
      },
      external,
    },
    lib: {
      entry: './src',
      name: 'MockAxios',
      formats: ['es', 'cjs', 'iife'],
    },
  },
});