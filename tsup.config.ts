import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*'],
  format: ['esm'],
  outDir: 'dist',
  dts: false,
  sourcemap: true,
  external: ['react', 'react-dom', '@tanstack/react-router', 'next'],
  tsconfig: 'tsconfig.json',
  clean: true,
  bundle: false,
  minify: false,
})
