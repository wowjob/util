import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts', 'src/**/*.tsx'],
  format: [], // No JS, only types
  outDir: 'dist',
  dts: true, // Generate `.d.ts`
  sourcemap: false, // No need for maps here
  clean: false, // Don't delete files from the first process
  bundle: false,
})
