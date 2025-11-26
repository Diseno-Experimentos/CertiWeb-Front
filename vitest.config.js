import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: [
        'src/public/**/*.js',
        'src/certifications/**/*.js',
        'src/config/**/*.js',
        'src/environments/**/*.js'
      ],
      exclude: ['node_modules/', 'src/**/*.vue', 'src/main.js']
    }
  }
})
