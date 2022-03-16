/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import dtsPlugin from 'vite-plugin-dts';
import { readFileSync } from 'fs';
import path from 'path';

const { dependencies = {}, devDependencies = {} } = JSON.parse(readFileSync('./package.json'));
const rootPath = path.resolve();
const outDir = 'dist';

const external = Object.keys({ ...dependencies, ...devDependencies });
export default defineConfig({
  plugins: [dtsPlugin({
    // skipDiagnostics: false,
    // logDiagnostics: true,
    beforeWriteFile(filePath, content) {
      return {
        filePath: filePath.replace(`${rootPath}/${outDir}/src`, `${rootPath}/${outDir}`),
        content,
      };
    },
  })],
  esbuild: {
    minify: true,
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    outDir,
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