import { defineConfig } from 'vitest/config'
import path from 'node:path'
export default defineConfig({resolve:{alias:{'@':path.resolve(__dirname,'.')}},test:{environment:'jsdom',setupFiles:['./tests/setup.ts'],exclude:['tests/e2e/**','node_modules/**'],coverage:{provider:'v8',reporter:['text','json-summary'],include:['lib/**/*.ts'],thresholds:{lines:80,functions:80,statements:80,branches:80}}}})
